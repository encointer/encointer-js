'use strict';

import {TypeRegistry, u64} from "@polkadot/types";
import {RegistryTypes} from "@polkadot/types/types";
import {options as encointerOptions} from "@encointer/node-api";
import {
    assignment_fn,
    assignment_fn_inverse,
    meetup_index,
    meetup_location,
    meetup_time,
    mod_inv
} from "@encointer/util/assignment";
import {AssignmentParams, MeetupIndexType, ParticipantIndexType, stringToDegree} from "@encointer/types";
import assert from "assert";

describe('assignment', () => {
    const registry = new TypeRegistry()

    beforeAll(() => {
        registry.register(encointerOptions().types as RegistryTypes)
    });

    it('assignment_fn works', () => {
        const pIndex = registry.createType('ParticipantIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const assignmentCount = registry.createType('u64', 5);

        expect(assignment_fn(pIndex, params, assignmentCount).toNumber()).toEqual(1)
    });

    it('meetup_index works', () => {
        const pIndex = registry.createType('ParticipantIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const meetupIndex = registry.createType('MeetupIndexType', 5);

        expect(meetup_index(pIndex, params, meetupIndex).toNumber()).toEqual(2)
    });

    it('meetup_location works', () => {
        const mIndex = registry.createType('MeetupIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const l = registry.createType('Location', {});
        const locations = registry.createType('Vec<Location>', [l, l]);

        expect(meetup_location(mIndex, locations, params).unwrap()).toEqual(l)
    });

    it('meetup_location returns none if locations empty', () => {
        const mIndex = registry.createType('MeetupIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const locations = registry.createType('Vec<Location>', []);

        expect(meetup_location(mIndex, locations, params).isNone)
    });

    it('meetup_time works', () => {
        const location = registry.createType('Location', {
            lat: stringToDegree("0"), // irrelevant
            lon: stringToDegree("20")
        });

        const attestingStart = registry.createType('Moment', 0);
        const oneDay = registry.createType('Moment', 360);

        expect(
            meetup_time(location, attestingStart, oneDay).toNumber()
        ).toEqual(200)
    });

    it('assignment_fn_inv works', () => {
        let params = registry.createType('AssignmentParams', [113, 78, 23]);
        let pCount = registry.createType('ParticipantIndexType', 118);
        let n = registry.createType('ParticipantIndexType', 12);
        check_assignment(pCount, params, n);

        params = registry.createType('AssignmentParams', [19, 1, 1]);
        pCount = registry.createType('ParticipantIndexType', 20);
        n = registry.createType('ParticipantIndexType', 2);
        check_assignment(pCount, params, n);

        params = registry.createType('AssignmentParams', [7, 1, 1]);
        pCount = registry.createType('ParticipantIndexType', 10);
        n = registry.createType('ParticipantIndexType', 1);
        check_assignment(pCount, params, n);
    });

    it('mod_inv works', () => {
        expect(mod_inv(2, 7)).toEqual(4)
        expect(mod_inv(69, 113)).toEqual(95)
        expect(mod_inv(111, 113)).toEqual(56)
    });
});

function check_assignment(participantCount: ParticipantIndexType, assignmentParams: AssignmentParams, n: u64) {
    const registry = assignmentParams.registry;
    const pCount = participantCount.toNumber();

    let locations = new Array(pCount).fill(0, 0, pCount);

    for (let i = 0; i < pCount; i++) {
        const pIndex = registry.createTypeUnsafe<ParticipantIndexType>('ParticipantIndexType', [i]);
        locations[i] = assignment_fn(pIndex, assignmentParams, n).toNumber()
    }

    let assignedParticipants = new Array(pCount).fill(false, 0, pCount);

    for (let i = 0; i < n.toNumber(); i++) {
        const mIndex = registry.createTypeUnsafe<MeetupIndexType>('MeetupIndexType', [i]);
        const participants = assignment_fn_inverse(mIndex, assignmentParams, n, participantCount)

        for (const p of participants) {
            let pNum = p.toNumber();

            assert(pNum < pCount, `participant index out of bound: ${pNum}, pCount: ${pCount}`);
            assignedParticipants[pNum] = true

            assert.equal(i, locations[pNum], `locations not equal`)
        }
    }

    assert(assignedParticipants.every((val) => val === true))
}
