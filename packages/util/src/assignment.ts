/// Helper stuff for the meetup assignment calculation

import {AssignmentParams, MeetupIndexType, ParticipantIndexType, Location, parseDegree} from "@encointer/types";
import {u64, Vec} from "@polkadot/types";
import BN from "bn.js";
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
export function assignmentFn(participantIndex: ParticipantIndexType, assignmentParams: AssignmentParams, assignmentCount: u64): ParticipantIndexType {
    const result = participantIndex
        .mul(assignmentParams.s1)
        .add(assignmentParams.s2)
        .mod(assignmentParams.m)
        .mod(assignmentCount);

    // We exploit the fact that all `Codec` types in polkadot-js have a registry attached, which points to the same
    // `api.registry` created at `Api` construction.
    return participantIndex.registry.createTypeUnsafe('ParticipantIndexType', [result]);
}

/**
 * Get the meetup index for a participant with given assigment params.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param meetupCount
 */
export function meetupIndex(participantIndex: ParticipantIndexType, assignmentParams: AssignmentParams, meetupCount: MeetupIndexType): MeetupIndexType {
    const result = assignmentFn(participantIndex, assignmentParams, meetupCount).add(new BN(1));

    return participantIndex.registry.createTypeUnsafe('MeetupIndexType', [result]);
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
 *
 * @param location
 * @param attesting_start
 * @param one_day
 */
export function meetupTime(location: Location, attesting_start: Moment, one_day: Moment): Moment {
    const registry = location.registry;

    const per_degree = one_day.toNumber() / 360;
    const lon_time = parseDegree(location.lon) * per_degree;

    let result = attesting_start.toNumber() + one_day.toNumber() / 2 + lon_time;

    return registry.createTypeUnsafe('Moment', [result])
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
