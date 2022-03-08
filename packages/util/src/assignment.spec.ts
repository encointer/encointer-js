'use strict';

import {TypeRegistry, u64} from "@polkadot/types";
import {RegistryTypes} from "@polkadot/types/types";
import {options as encointerOptions} from "@encointer/node-api";
import {
    assignmentFn,
    assignmentFnInverse,
    computeMeetupIndex,
    getRegistrationType,
    meetupIndex,
    meetupLocation,
    meetupTime,
    modInv, ParticipantIndexes
} from "@encointer/util/assignment";
import {
    AssignmentParams, CommunityCeremonyStats,
    MeetupIndexType,
    ParticipantIndexType,
    stringToDegree
} from "@encointer/types";
import assert from "assert";

describe('assignment', () => {
    const registry = new TypeRegistry()
    let testCommunityCeremony: CommunityCeremonyStats;

    beforeAll(() => {
        registry.register(encointerOptions().types as RegistryTypes)

        testCommunityCeremony = registry.createType('CommunityCeremonyStats', communityCeremony)
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

    it('computeMeetupIndex returns 0 for unassigned participant', () => {
        const pIndex0 = registry.createType('ParticipantIndexType', 0);
        const pIndex6 = registry.createType('ParticipantIndexType', 6);
        let meetupCount = registry.createType('MeetupIndexType', 1);
        let assignment = registry.createType('Assignment');
        let assignmentCount = registry.createType('AssignmentCount', [3, 3, 3, 3]);

        const compute =
            (pindexes: ParticipantIndexes) => computeMeetupIndex(getRegistrationType(pindexes).unwrap(), assignment, assignmentCount, meetupCount)

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

    it('creates ceremonyStats', () => {
        const stats = registry.createType('CommunityCeremonyStats', communityCeremony);

        console.log(`${JSON.stringify(stats)}`);
        // fails until we create participants in ss58 format
        // expect(stats.toJSON()).toBe(communityCeremony)
    });

    const communityCeremony = {
        communityCeremony: ['srcq45PYNyD', 1045],
        assignment: {
            bootstrappersReputables: {
                m: 7,
                s1: 6,
                s2: 4
            },
            endorsees: {
                m: 7,
                s1: 6,
                s2: 5
            },
            newbies: {
                m: 2,
                s1: 1,
                s2: 1
            },
            locations: {
                m: 9,
                s1: 1,
                s2: 7
            }
        },
        assignmentCount: {
            bootstrappers: 10,
            reputables: 0,
            endorsees: 10,
            newbies: 2
        },
        meetupCount: 3,
        meetups: [{
            index: 1,
            location: {
                lat: '13.5947899999999997078',
                lon: '-54.14987899999999854117'
            },
            time: 1646753760000,
            registrations: [['0xbc92e2f48a3af6f54d5dbb3cd9a6ded4d59218020502464997ced2d71a507b4e', {
                index: 5,
                registrationType: 'Bootstrapper',
            }], ['0x2ebc2d24537019a2fe6ff2c5b8069526845e3f543aea720391ce57a96b82ad09', {
                index: 2,
                registrationType: 'Bootstrapper',
            }], ['0x2a7c54cba3ac5e1cdc4ce983c360b69c3059b6faaaa5bcfb3d3d99b560d8963c', {
                index: 9,
                registrationType: 'Bootstrapper',
            }], ['0xca9b21c0a81622d85afb45aacc033efb40fc310ecb0bca855014a1c1a54bcd67', {
                index: 6,
                registrationType: 'Bootstrapper',
            }], ['0x6a0eb8650fb4a32a90e7407478b22b2569eaad2605ec0ab9af13777b482e2d1a', {
                index: 6,
                registrationType: 'Endorsee',
            }], ['0x18bd9e2b98fc15c3bbc0093c6b009e2dde35a74819ab42a483ed3096b983b816', {
                index: 3,
                registrationType: 'Endorsee',
            }], ['0x1a09277c4f77ecc42dea0d20d7629fcfbb43fc9e4233831122e13cc514645420', {
                index: 10,
                registrationType: 'Endorsee',
            }], ['0x3a00401092b6bd75565889e85503ad4fbf2bf9d17710412e1e0f0c590e7a9c07', {
                index: 7,
                registrationType: 'Endorsee',
            }], ['0x30b3e1899a7483fd61f41069601e3671f6f35e3b96f4de902f6e15230f0d8171', {
                index: 2,
                registrationType: 'Newbie',
            }]
            ]
        }]
    }


    communityCeremony.meetups.forEach((meetup) => {
        meetup.registrations.forEach((registration, index) => {
            it(`registration with pIndex: ${registration[1].index}`, () => {

                console.log(`testcommunity: ${JSON.stringify(testCommunityCeremony)}`);
                console.log(`registration: ${JSON.stringify(registration[1])}`);

                const reg = registry.createType('ParticipantRegistration', registration[1]);

                console.log(`Meetup: ${JSON.stringify(meetup)}`);
                console.log(`MeetupCount: ${testCommunityCeremony.meetupCount}`);
                console.log(`Registration: ${reg}`);

                expect(computeMeetupIndex(reg,
                    testCommunityCeremony.assignment,
                    testCommunityCeremony.assignmentCount,
                    testCommunityCeremony.meetupCount)
                ).toEqual(meetup.index);
            })

        })
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
