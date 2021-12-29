/// Helper stuff for the meetup assignment calculation

import {AssignmentParams, MeetupIndexType, ParticipantIndexType, Location, parseDegree} from "@encointer/types";
import {u64, Vec} from "@polkadot/types";
import BN from "bn.js";
import {Option} from "@polkadot/types-codec";
import {Moment} from "@polkadot/types/interfaces/runtime";

/**
 * Performs the same meetup assignment as the encointer-ceremonies pallet.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param assignmentCount
 */
export function assignment_fn(participantIndex: ParticipantIndexType, assignmentParams: AssignmentParams, assignmentCount: u64): ParticipantIndexType {
    const result = participantIndex
        .mul(assignmentParams.s1)
        .add(assignmentParams.s2)
        .mod(assignmentParams.m)
        .mod(assignmentCount);

    // We exploit the fact that all `Codec` types in polkadot-js have a registry attached, which points to the same
    // `api.registry` created at `Api` construction.
    return participantIndex.registry.createTypeUnsafe('ParticipantIndex', [result]);
}

/**
 * Get the meetup index for a participant with given assigment params.
 *
 * @param participantIndex
 * @param assignmentParams
 * @param meetupCount
 */
export function meetup_index(participantIndex: ParticipantIndexType, assignmentParams: AssignmentParams, meetupCount: MeetupIndexType): MeetupIndexType {
    const result = assignment_fn(participantIndex, assignmentParams, meetupCount).add(new BN(1));

    return participantIndex.registry.createTypeUnsafe('MeetupIndexType',  [result]);
}


/**
 * Get the location for a given meetup.
 *
 * @param meetupIndex
 * @param locations
 * @param locationAssignmentParams
 */
export function meetup_location(meetupIndex: MeetupIndexType, locations: Vec<Location>, locationAssignmentParams: AssignmentParams): Option<Location> {
    const registry = meetupIndex.registry;

    // need the explicit u64 cast here, otherwise we get an illegal argument in `assignment_fn`
    const len: u64 = registry.createTypeUnsafe('u64', [locations.length]);

    const location_index = assignment_fn(meetupIndex, locationAssignmentParams, len)

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
export function meetup_time(location: Location, attesting_start: Moment, one_day: Moment): Moment {
    const registry = location.registry;

    const per_degree = one_day.toNumber() / 360;
    const lon_time = parseDegree(location.lon) * per_degree;

    let result =  attesting_start.toNumber() + one_day.toNumber() / 2 + lon_time;

    return registry.createTypeUnsafe('Moment', [result])
}
