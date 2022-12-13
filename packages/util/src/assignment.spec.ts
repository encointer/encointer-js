'use strict';

import {TypeRegistry, u64, Vec} from "@polkadot/types";
import {RegistryTypes} from "@polkadot/types/types";
import {options as encointerOptions} from "@encointer/node-api";
import {
    assignmentFn,
    assignmentFnInverse,
    computeMeetupIndex, computeStartOfAttestingPhase,
    getRegistration,
    meetupIndex,
    meetupLocation,
    meetupTime,
    modInv, ParticipantIndexes
} from "@encointer/util/assignment";
import {
    AssignmentParams, CeremonyPhaseType,
    MeetupIndexType, Location,
    ParticipantIndexType,
    stringToDegree, MeetupTimeOffsetType, Assignment, AssignmentCount, CommunityCeremonyStats, ParticipantRegistration
} from "@encointer/types";
import assert from "assert";
import * as testCeremonies from "./test-ceremony-data";
import {Moment} from "@polkadot/types/interfaces/runtime";

describe('assignment', () => {
    const registry = new TypeRegistry()
    const ceremonyTestCases = Object.values(testCeremonies);

    beforeAll(() => {
        registry.register(encointerOptions().types as RegistryTypes)
    });

    it('assignmentFn works', () => {
        const pIndex = registry.createType<ParticipantIndexType>('ParticipantIndexType', 6);
        const params = registry.createType<AssignmentParams>('AssignmentParams', [4, 5, 3]);
        const assignmentCount = registry.createType('u64', 5);

        expect(assignmentFn(pIndex, params, assignmentCount).toNumber()).toEqual(1)
    });

    it('meetupIndex works', () => {
        const pIndex = registry.createType<ParticipantIndexType>('ParticipantIndexType', 6);
        const params = registry.createType<AssignmentParams>('AssignmentParams', [4, 5, 3]);
        const mIndex = registry.createType<MeetupIndexType>('MeetupIndexType', 5);

        expect(meetupIndex(pIndex, params, mIndex).toNumber()).toEqual(2)
    });

    it('meetupLocation works', () => {
        const mIndex = registry.createType<MeetupIndexType>('MeetupIndexType', 6);
        const params = registry.createType<AssignmentParams>('AssignmentParams', [4, 5, 3]);
        const l = registry.createType<Location>('Location', {});
        const locations = registry.createType<Vec<Location>>('Vec<Location>', [l, l]);

        expect(meetupLocation(mIndex, locations, params).unwrap()).toEqual(l)
    });

    it('meetup_location returns none if locations empty', () => {
        const mIndex = registry.createType<MeetupIndexType>('MeetupIndexType', 6);
        const params = registry.createType<AssignmentParams>('AssignmentParams', [4, 5, 3]);
        const locations = registry.createType<Vec<Location>>('Vec<Location>', []);

        expect(meetupLocation(mIndex, locations, params).isNone)
    });

    const meetupTimeTestCases = [
        {
            description: "is correct without offset",
            longitude: "20",
            offset: 0,
            expected: 160
        },
        {
            description: "is correct for non-integer results",
            longitude: "19.5",
            offset: 0,
            expected: 161
        },
        {
            description: "is correct for positive offset",
            longitude: "20",
            offset: 1,
            expected: 161
        },
        {
            description: "is correct result for negative offset",
            longitude: "20",
            offset: -1,
            expected: 159
        }
    ];

    meetupTimeTestCases.forEach((test) => {
        const attestingStart = registry.createType('Moment', 0);
        const oneDay = registry.createType('Moment', 360);

        it(`meetupTime ${test.description}`, () => {
            const meetupOffset = registry.createType<MeetupTimeOffsetType>('MeetupTimeOffsetType', test.offset);
            const location = registry.createType<Location>('Location', {
                lat: stringToDegree("0"), // irrelevant
                lon: stringToDegree(test.longitude)
            });

            expect(
                meetupTime(location, attestingStart, oneDay, meetupOffset).toNumber()
            ).toEqual(test.expected)
        })
    })

    it(`meetupTime yields correct result in realworld scenario`, () => {
        const attestingStart = registry.createType('Moment', "1671408000000"); // Mon Dec 19 2022 00:00:00 UTC
        const oneDay = registry.createType('Moment', "86400000");
        const meetupOffset = registry.createType('MeetupTimeOffsetType', "-2100000"); // 35min
        const location = registry.createType('Location', {
            lat: stringToDegree("0"), // irrelevant
            lon: stringToDegree("-88.15") // greenbay
        });

        expect(
            Math.abs(meetupTime(location, attestingStart, oneDay, meetupOffset).toNumber() - 1671470220000) // Mon Dec 19 2022 17:17:00 UTC
        ).toBeLessThan(60000)
    })

    const computeStartOfAttestingTestCases = [
        { currentPhase: 'Registering', expected: 105},
        { currentPhase: 'Assigning', expected: 100 },
        { currentPhase: 'Attesting', expected: 90 },
    ];

    computeStartOfAttestingTestCases.forEach((test) => {
        const nextPhaseStart = registry.createType<Moment>('Moment', 100);
        const assigningDuration = registry.createType<Moment>('Moment', 5);
        const attestingDuration = registry.createType<Moment>('Moment', 10);


        it(`computeStartOfAttesting works in ${test.currentPhase}`, () => {
            const currentPhase = registry.createType<CeremonyPhaseType>('CeremonyPhaseType', test.currentPhase);
            expect(
                computeStartOfAttestingPhase(
                    currentPhase,
                    nextPhaseStart,
                    assigningDuration,
                    attestingDuration
                ).toNumber()
            ).toEqual(test.expected);
        });

    })

    it('assignmentFnInverse works', () => {
        let params = registry.createType<AssignmentParams>('AssignmentParams', [113, 78, 23]);
        let pCount = registry.createType<ParticipantIndexType>('ParticipantIndexType', 118);
        let n = registry.createType<ParticipantIndexType>('ParticipantIndexType', 12);
        checkAssignment(pCount, params, n);

        params = registry.createType<AssignmentParams>('AssignmentParams', [19, 1, 1]);
        pCount = registry.createType<ParticipantIndexType>('ParticipantIndexType', 20);
        n = registry.createType<ParticipantIndexType>('ParticipantIndexType', 2);
        checkAssignment(pCount, params, n);

        params = registry.createType<AssignmentParams>('AssignmentParams', [7, 1, 1]);
        pCount = registry.createType<ParticipantIndexType>('ParticipantIndexType', 10);
        n = registry.createType<ParticipantIndexType>('ParticipantIndexType', 1);
        checkAssignment(pCount, params, n);
    });

    it('modInv works', () => {
        expect(modInv(2, 7)).toEqual(4)
        expect(modInv(69, 113)).toEqual(95)
        expect(modInv(111, 113)).toEqual(56)
    });

    it('computeMeetupIndex returns 0 for unassigned participant', () => {
        const pIndex0 = registry.createType<ParticipantIndexType>('ParticipantIndexType', 0);
        const pIndex6 = registry.createType<ParticipantIndexType>('ParticipantIndexType', 6);
        let meetupCount = registry.createType<MeetupIndexType>('MeetupIndexType', 1);
        let assignment = registry.createType<Assignment>('Assignment');
        let assignmentCount = registry.createType<AssignmentCount>('AssignmentCount', [3, 3, 3, 3]);

        const compute =
            (pindexes: ParticipantIndexes) => computeMeetupIndex(getRegistration(pindexes).unwrap(), assignment, assignmentCount, meetupCount)

        expect(
            compute([pIndex6, pIndex0, pIndex0, pIndex0]).toNumber()
        ).toEqual(0)

        expect(
            compute([pIndex0, pIndex6, pIndex0, pIndex0]).toNumber()
        ).toEqual(0)

        expect(
            compute([pIndex0, pIndex0, pIndex6, pIndex0]).toNumber()
        ).toEqual(0)

        expect(
            compute([pIndex0, pIndex0, pIndex0, pIndex6]).toNumber()
        ).toEqual(0)
    });

    ceremonyTestCases.forEach((ceremonyTestCase) => {
        it(`creates correct CommunityCeremonyStats for ${ceremonyTestCase.communityCeremony} `, () => {
            const testCeremony = registry.createType<CommunityCeremonyStats>('CommunityCeremonyStats', ceremonyTestCase)

            expect(JSON.stringify(testCeremony)).toBe(JSON.stringify(ceremonyTestCase))
        });
    });


    ceremonyTestCases.forEach((ceremonyTestCase) => {
        ceremonyTestCase.meetups.forEach((meetup) => {
            meetup.registrations.forEach((registration, index) => {

                // @ts-ignore
                it(`test computeMeetupIndex for ceremony ${ceremonyTestCase.communityCeremony}: for [mIndex, pIndex]: [${meetup.index}, ${registration[1].index}]`, () => {

                    const testCeremony = registry.createType<CommunityCeremonyStats>('CommunityCeremonyStats', ceremonyTestCase)

                    // console.log(`testCommunity: ${JSON.stringify(testCeremony)}`);

                    const reg = registry.createType<ParticipantRegistration>('ParticipantRegistration', registration[1]);

                    expect(computeMeetupIndex(reg,
                            testCeremony.assignment,
                            testCeremony.assignmentCount,
                            testCeremony.meetupCount
                        ).toNumber()
                    ).toEqual(meetup.index);
                })

            })
        });
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
