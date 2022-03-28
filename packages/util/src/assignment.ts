/// Helper stuff for the meetup assignment calculation

import {
    AssignmentParams,
    MeetupIndexType,
    ParticipantIndexType,
    Location,
    parseDegree,
    Assignment, AssignmentCount, ParticipantRegistration, MeetupTimeOffsetType, CeremonyPhaseType
} from "@encointer/types";
import {u64, Vec} from "@polkadot/types";
import {Option} from "@polkadot/types-codec";
import {Moment} from "@polkadot/types/interfaces/runtime";
import assert from "assert";

/**
 * Performs the same meetup assignment as the encointer-ceremonies pallet.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param assignmentCount
 */
export function assignmentFn(participantIndex: ParticipantIndexType, assignmentParams: AssignmentParams, assignmentCount: u64): MeetupIndexType {

    if (assignmentParams.m.eq(0) || assignmentCount.eq(0)) {
        console.log(`[assignmentFn] invalid params or assignmentCount. Returning 0`);
        return participantIndex.registry.createTypeUnsafe('MeetupIndexType', [0]);
    }

    return participantIndex
        .mul(assignmentParams.s1)
        .add(assignmentParams.s2)
        .mod(assignmentParams.m)
        .mod(assignmentCount) as MeetupIndexType
}

/**
 * Registries in the order: [bootstrapperIndex, reputableIndex, endorseeIndex, newbieIndex]
 */
export type ParticipantIndexes = [ParticipantIndexType, ParticipantIndexType, ParticipantIndexType, ParticipantIndexType];

export function getRegistration(pIndexes: ParticipantIndexes): Option<ParticipantRegistration> {
    const registry = pIndexes[0].registry;

    console.log(`[getRegistration] pIndexes: ${JSON.stringify(pIndexes)}`);

    if (!pIndexes[0].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[0], 'Bootstrapper']]);
    } else if (!pIndexes[1].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[1], 'Reputable']]);
    } else if (!pIndexes[2].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[2], 'Endorsee']]);
    } else if (!pIndexes[3].eq(0)) {
        return registry.createTypeUnsafe('Option<ParticipantRegistration>', [[pIndexes[3], 'Newbie']]);
    }

    return registry.createTypeUnsafe('Option<ParticipantRegistration>', []);
}

/**
 * Computes the meetup index given the all the meetup params.
 *
 * Returns 0 if the participant has not been assigned.
 */
export function computeMeetupIndex(
    registration: ParticipantRegistration,
    assignments: Assignment,
    assignmentCount: AssignmentCount,
    meetupCount: MeetupIndexType
): MeetupIndexType {
    const registry = assignmentCount.registry;
    let pIndex: ParticipantIndexType;

    if (meetupCount.eq(0)) {
        // 0 index means not registered
        return meetupCount;
    }

    if (registration.index.eq(0)) {
        console.log("[computeMeetupIndex] supplied registration with participantIndex = 0. returning...")
        return registration.index;
    } else {
        pIndex = registration.index.subn(1) as ParticipantIndexType;
    }

    const meetupIndexFn =
        (pIndex: ParticipantIndexType, params: AssignmentParams) => meetupIndex(pIndex, params, meetupCount);

    if (registration.registrationType.isBootstrapper) {
        console.log("[computeMeetupIndex] is bootstrapper.")
        if (pIndex.lt(assignmentCount.bootstrappers)) {
            return meetupIndexFn(pIndex, assignments.bootstrappersReputables)
        }
    } else if (registration.registrationType.isReputable) {
        console.log("[computeMeetupIndex] is reputable")
        if (pIndex.lt(assignmentCount.reputables)) {
            return meetupIndexFn(
                pIndex.add(assignmentCount.bootstrappers) as ParticipantIndexType,
                assignments.bootstrappersReputables
            )
        }
    } else if (registration.registrationType.isEndorsee) {
        console.log("[computeMeetupIndex] is endorsee.")
        if (pIndex.lt(assignmentCount.endorsees)) {
            return meetupIndexFn(pIndex, assignments.endorsees);
        }
    } else if (registration.registrationType.isNewbie) {
        console.log("[computeMeetupIndex] is endorsee.")
        if (pIndex.lt(assignmentCount.newbies)){
            return meetupIndexFn(pIndex, assignments.newbies);
        }
    }

    return registry.createTypeUnsafe('MeetupIndexType', [0]);
}

/**
 * Get the meetup index for a participant with given assigment params.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param meetupCount
 */
export function meetupIndex(participantIndex: ParticipantIndexType, assignmentParams: AssignmentParams, meetupCount: MeetupIndexType): MeetupIndexType {

    console.log(`[meetupIndex] executing assignmentFn`);

    const result = assignmentFn(participantIndex, assignmentParams, meetupCount);

    const mIndex = result.addn(1) as MeetupIndexType

    console.log(`[meetupIndex] mIndex (=assignmentFn result + 1): ${JSON.stringify(mIndex)}`);

    return mIndex;
}


/**
 * Get the location for a given meetup.
 *
 * @param meetupIndex
 * @param locations
 * @param locationAssignmentParams
 */
export function meetupLocation(meetupIndex: MeetupIndexType, locations: Vec<Location>, locationAssignmentParams: AssignmentParams): Option<Location> {
    const registry = meetupIndex.registry;

    // not sure why we need to specify the type here explicitly.
    const len: u64 = registry.createTypeUnsafe('u64', [locations.length]);

    if (len.eq(0)) {
        console.log(`[meetup_location]: Locations empty: ${len}`)
        return registry.createTypeUnsafe('Option<Location>', [])
    }

    const location_index = assignmentFn(meetupIndex, locationAssignmentParams, len)

    if (location_index < len) {
        return registry.createTypeUnsafe('Option<Location>', [locations[location_index.toNumber()]])
    } else {
        console.log(`[meetup_location]: Location index is out of bounds ${location_index}. Locations length: ${len}`)
        return registry.createTypeUnsafe('Option<Location>', [])
    }
}

/**
 * Get the meetup time for a given location.
 */
export function meetupTime(location: Location, attesting_start: Moment, one_day: Moment, offset: MeetupTimeOffsetType): Moment {
    const registry = location.registry;

    const per_degree = one_day.toNumber() / 360;

    // The meetups start at high sun at 180 degrees and during one day the meetup locations travel
    // along the globe until the very last meetup happens at high sun at -180 degrees.
    // So we scale the range 180...-180 to 0...360
    const lon = Math.abs(parseDegree(location.lon) - 180);
    const lon_time = lon * per_degree;

    let result = Math.round(attesting_start.toNumber() + lon_time + offset.toNumber());

    return registry.createTypeUnsafe('Moment', [result])
}

export function computeStartOfAttestingPhase(
    currentPhase: CeremonyPhaseType,
    nextPhaseStart: Moment,
    assigningDuration: Moment,
    attestingDuration: Moment
): Moment {
    if (currentPhase.isRegistering) {
        return nextPhaseStart.add(assigningDuration) as Moment
    } else if (currentPhase.isAssigning) {
        return nextPhaseStart;
    } else if (currentPhase.isAttesting) {
        return nextPhaseStart.sub(attestingDuration) as Moment
    } else {
        throw `[computeStartOfAttestingPhase] Unknown phase supplied: ${currentPhase}`;
    }
}

/**
 * Returns the participants for a given assignment configuration.
 *
 * @param meetupIndex
 * @param assignmentParams
 * @param assignmentCount
 * @param participantCount
 */
export function assignmentFnInverse(
    meetupIndex: MeetupIndexType,
    assignmentParams: AssignmentParams,
    assignmentCount: MeetupIndexType,
    participantCount: ParticipantIndexType): Vec<ParticipantIndexType> {
    const registry = meetupIndex.registry;

    // safe; the numbers will not exceed 2^53
    const mIndex = meetupIndex.toNumber();
    const m = assignmentParams.m.toNumber();
    const aCount = assignmentCount.toNumber();
    const pCount = participantCount.toNumber();

    const maxIndex = Math.ceil(Math.max(m - mIndex, 0) / aCount);

    let participants: number[] = [];

    for (let i = 0; i < maxIndex; i++) {
        const t2 = modInv(assignmentParams.s1.toNumber(), m);

        const t3 = t3Fn(aCount, i, mIndex, assignmentParams, t2);

        if (t3 >= pCount) {
            continue;
        }

        // never observed in practice
        assert(t3 >= 0, `[assignment_fn_inverse]: t3 smaller 0: ${t3}`);

        participants.push(t3)

        if (t3 < pCount - m) {
            participants.push(t3 + m)
        }
    }

    return registry.createTypeUnsafe('Vec<ParticipantIndexType>', [participants]);
}

export function modInv(a: number, module: number): number {
    let mn = [module, a];
    let xy = [0, 1]

    while (mn[1] != 0) {
        xy = [xy[1], xy[0] - Math.floor((mn[0] / mn[1])) * xy[1]];
        mn = [mn[1], mn[0] % mn[1]];
    }

    while (xy[0] < 0) {
        xy[0] += module;
    }

    return xy[0]
}

function t3Fn(n: number, currentIndex: number, meetupIndex: number, params: AssignmentParams, t2: number): number {
    const x = (n * currentIndex) + meetupIndex - params.s2.toNumber();
    const y = remainder(x, params.m.toNumber()) * t2;

    return remainder(y, params.m.toNumber());
}

/**
 * Returns the integer division remainder.
 * @param n
 * @param m
 */
function remainder(n: number, m: number) {
    return ((n % m) + m) % m;
}
