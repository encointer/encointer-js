'use strict';

import {TypeRegistry, u64} from "@polkadot/types";
import {RegistryTypes} from "@polkadot/types/types";
import {options as encointerOptions} from "@encointer/node-api";
import {
    assignmentFn,
    assignmentFnInverse,
    meetupIndex,
    meetupLocation,
    meetupTime,
    modInv
} from "@encointer/util/assignment";
import {AssignmentParams, MeetupIndexType, ParticipantIndexType, stringToDegree} from "@encointer/types";
import assert from "assert";

describe('assignment', () => {
    const registry = new TypeRegistry()

    beforeAll(() => {
        registry.register(encointerOptions().types as RegistryTypes)
    });

    it('assignmentFn works', () => {
        const pIndex = registry.createType('ParticipantIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const assignmentCount = registry.createType('u64', 5);

        expect(assignmentFn(pIndex, params, assignmentCount).toNumber()).toEqual(1)
    });

    it('meetupIndex works', () => {
        const pIndex = registry.createType('ParticipantIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const mIndex = registry.createType('MeetupIndexType', 5);

        expect(meetupIndex(pIndex, params, mIndex).toNumber()).toEqual(2)
    });

    it('meetupLocation works', () => {
        const mIndex = registry.createType('MeetupIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const l = registry.createType('Location', {});
        const locations = registry.createType('Vec<Location>', [l, l]);

        expect(meetupLocation(mIndex, locations, params).unwrap()).toEqual(l)
    });

    it('meetup_location returns none if locations empty', () => {
        const mIndex = registry.createType('MeetupIndexType', 6);
        const params = registry.createType('AssignmentParams', [4, 5, 3]);
        const locations = registry.createType('Vec<Location>', []);

        expect(meetupLocation(mIndex, locations, params).isNone)
    });

    it('meetupTime works', () => {
        const location = registry.createType('Location', {
            lat: stringToDegree("0"), // irrelevant
            lon: stringToDegree("20")
        });

        const attestingStart = registry.createType('Moment', 0);
        const oneDay = registry.createType('Moment', 360);

        expect(
            meetupTime(location, attestingStart, oneDay).toNumber()
        ).toEqual(160)
    });

    it('meetupTime works for non-integer results', () => {
        const location = registry.createType('Location', {
            lat: stringToDegree("0"), // irrelevant
            lon: stringToDegree("20")
        });

        const attestingStart = registry.createType('Moment', 0);
        const oneDay = registry.createType('Moment', 178);

        expect(
            meetupTime(location, attestingStart, oneDay).toNumber()
        ).toEqual(79)
    });

    it('assignmentFnInverse works', () => {
        let params = registry.createType('AssignmentParams', [113, 78, 23]);
        let pCount = registry.createType('ParticipantIndexType', 118);
        let n = registry.createType('ParticipantIndexType', 12);
        checkAssignment(pCount, params, n);

        params = registry.createType('AssignmentParams', [19, 1, 1]);
        pCount = registry.createType('ParticipantIndexType', 20);
        n = registry.createType('ParticipantIndexType', 2);
        checkAssignment(pCount, params, n);

        params = registry.createType('AssignmentParams', [7, 1, 1]);
        pCount = registry.createType('ParticipantIndexType', 10);
        n = registry.createType('ParticipantIndexType', 1);
        checkAssignment(pCount, params, n);
    });

    it('modInv works', () => {
        expect(modInv(2, 7)).toEqual(4)
        expect(modInv(69, 113)).toEqual(95)
        expect(modInv(111, 113)).toEqual(56)
    });
});

function checkAssignment(participantCount: ParticipantIndexType, assignmentParams: AssignmentParams, n: u64) {
    const registry = assignmentParams.registry;
    const pCount = participantCount.toNumber();

    let locations = new Array(pCount).fill(0, 0, pCount);

    for (let i = 0; i < pCount; i++) {
        const pIndex = registry.createTypeUnsafe<ParticipantIndexType>('ParticipantIndexType', [i]);
        locations[i] = assignmentFn(pIndex, assignmentParams, n).toNumber()
    }

    let assignedParticipants = new Array(pCount).fill(false, 0, pCount);

    for (let i = 0; i < n.toNumber(); i++) {
        const mIndex = registry.createTypeUnsafe<MeetupIndexType>('MeetupIndexType', [i]);
        const participants = assignmentFnInverse(mIndex, assignmentParams, n, participantCount)

        for (const p of participants) {
            let pNum = p.toNumber();

            assert(pNum < pCount, `participant index out of bound: ${pNum}, pCount: ${pCount}`);
            assignedParticipants[pNum] = true

            assert.equal(i, locations[pNum], `locations not equal`)
        }
    }

    assert(assignedParticipants.every((val) => val === true))
}
