'use strict';

import {TypeRegistry} from "@polkadot/types";
import {RegistryTypes} from "@polkadot/types/types";
import {options as encointerOptions} from "@encointer/node-api";
import {assignment_fn, meetup_index, meetup_location, meetup_time, mod_inv} from "@encointer/util/assignment";
import {stringToDegree} from "@encointer/types";

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

        expect(meetup_time(location, attestingStart, oneDay).toNumber()).toEqual(
            200
        )
    });

    it('mod_inv works', () => {
        expect(mod_inv(2, 7)).toEqual(4)
        expect(mod_inv(69, 113)).toEqual(95)
        expect(mod_inv(111, 113)).toEqual(56)
    });
});
