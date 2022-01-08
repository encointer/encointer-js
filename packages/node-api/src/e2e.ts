import {ApiPromise, Keyring, WsProvider} from '@polkadot/api';
import {options} from "@encointer/node-api/options";
import {communityIdentifierFromString} from "../../util/src";
import {CeremonyIndexType, CommunityIdentifier, MeetupIndexType, stringToDegree} from "../../types/src";
import {cryptoWaitReady} from "@polkadot/util-crypto";
import {submitAndWatchTx} from "./tx";
import {ISubmitAndWatchResult} from "./interface";
import {KeyringPair} from "@polkadot/keyring/types";
import {
    getAssignment,
    getAssignmentCount,
    getMeetupCount,
    getMeetupIndex,
    getMeetupLocation,
    getMeetupParticipants,
    getParticipantIndex
} from './encointer-api';

describe('node-api', () => {
    let keyring: Keyring;
    let api: ApiPromise;
    let testCid: CommunityIdentifier;
    let testCIndex: CeremonyIndexType;
    let testMeetupIndex: MeetupIndexType;
    let alice: KeyringPair;
    let bob: KeyringPair;
    let charlie: KeyringPair;
    const chain = 'ws://127.0.0.1:9944';
    beforeAll(async () => {
        await cryptoWaitReady();

        keyring = new Keyring({type: 'sr25519'});
        alice = keyring.addFromUri('//Alice', {name: 'Alice default'});
        bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
        charlie = keyring.addFromUri('//Charlie', {name: 'Charlie default'});

        const provider = new WsProvider('ws://127.0.0.1:9944');
        try {
            api = await ApiPromise.create({
                ...options(),
                provider: provider
            });
            console.log(`${chain} wss connected success`);
        } catch (err) {
            console.log(`connect ${chain} failed`);
            await provider.disconnect();
        }

        let res = await _registerTestCommunity(api, alice);

        if (res.error !== undefined) {
            console.log(`failed to register test community: ${JSON.stringify(res)}`);
        }

        testCid = communityIdentifierFromString(api.registry, testCommunityParams.cid)
        testCIndex = api.createType('CeremonyIndexType', 1)
        testMeetupIndex = api.createType('MeetupIndexType', 1)

        await registerAliceBobCharlieAndGoToAttesting(api, testCid)

    }, 40000);

    afterAll(async () => {
        // Jest fails to exit after the tests without this.
        await api.disconnect();
    });

    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query.encointerScheduler.currentPhase();
            // console.log(result);
            expect(result).toBeDefined();
        });
    });

    describe('assignment', () => {
        it('should get assignmentCount', async () => {
            const result = await getAssignmentCount(api, testCid, testCIndex);
            expect(result.toJSON()).toStrictEqual({
                "bootstrappers": 3,
                "endorsees": 0,
                "newbies": 0,
                "reputables": 0,
            });
        });

        it('should get assignment', async () => {
            const assignment = await getAssignment(api, testCid, testCIndex);

            // hard to test as it is randomized.
            expect(assignment.bootstrappersReputables.m.toNumber()).toBe(3);
            expect(assignment.bootstrappersReputables.s1.toNumber()).toBeLessThan(3);
            expect(assignment.bootstrappersReputables.s2.toNumber()).toBeLessThan(3);

            // no endorsees and newbies assigned
            expect(assignment.endorsees.toJSON()).toStrictEqual({"m": 2, "s1": 1, "s2": 1})
            expect(assignment.newbies.toJSON()).toStrictEqual({"m": 2, "s1": 1, "s2": 1})
        });

        it('should get meetupCount', async () => {
            const result = await getMeetupCount(api, testCid, testCIndex);
            expect(result.toNumber()).toBe(1);
        });

        it('should get meetupIndex', async () => {
            for (const participant of [alice, bob, charlie]) {
                const assignment = await getMeetupIndex(api, testCid, testCIndex, participant.address);
                expect(assignment.toNumber()).toBe(1);
            }
        });

        it('should get meetupLocation', async () => {
            const location = await getMeetupLocation(api, testCid, testCIndex, testMeetupIndex);
            expect(location.toJSON()).toStrictEqual(testCommunityParams.locations[0]);
        });

        it('should get meetupParticipants', async () => {
            // Todo: this test only covers bootstrappers. How do we test reputables, endorsees and newbies?
            // This might be too tedious, we'd need to go to the second ceremony and also register more participants.
            const participants = await getMeetupParticipants(api, testCid, testCIndex, testMeetupIndex);
            expect(participants.sort().toJSON())
                .toStrictEqual([alice.address, bob.address, charlie.address].sort());
        });

        it('should get participantIndex', async () => {
            for (const [i, participant] of [alice, bob, charlie].entries()) {
                const pIndex = await getParticipantIndex(api, testCid, testCIndex, participant.address);
                expect(pIndex.toNumber()).toBe(i + 1);
            }
        });

    });

    describe('rpc', () => {
        // These tests predominantly verify that we have correct rpc/type definitions
        describe('communities', () => {
            it('communities.GetAll should return empty vec', async () => {
                // @ts-ignore
                const cidNames = await api.rpc.communities.getAll();
                expect(cidNames[0].cid).toStrictEqual(testCid);
            });

            it('communities.getLocations should return error on unknown community', async () => {
                let cid = communityIdentifierFromString(api.registry, "gbsuv7YXq9G")

                try {
                    // @ts-ignore
                    await api.rpc.communities.getLocations(cid)
                } catch (e: any) {
                    expect(e.toString()).toBe("Error: 3: Offchain storage not found: Key [99, 105, 100, 115, 103, 98, 115, 117, 118, 255, 255, 255, 255]");
                }

            });
        });

        describe('bazaar', () => {
            it('bazaar.GetBusinesses should return empty vec', async () => {
                const cid = api.createType('CommunityIdentifier', {
                    geohash: [0x00, 0x00, 0x00, 0x00, 0x00],
                    digest: [0x00, 0x00, 0x00, 0x00,],
                });

                // @ts-ignore
                const result = await api.rpc.bazaar.getBusinesses(cid.toHex());
                // console.log(result);
                expect(result.length).toBe(0);
            });

            it('bazaar.GetOfferings should return empty vec', async () => {
                // random cid
                let cid = communityIdentifierFromString(api.registry, "gbsuv7YXq9G")
                // @ts-ignore
                const result = await api.rpc.bazaar.getOfferings(cid);
                // console.log(result);
                expect(result.length).toBe(0);
            });

            it('bazaar.GetOfferingsForBusiness should return empty vec', async () => {
                // random cid
                let cid = communityIdentifierFromString(api.registry, "gbsuv7YXq9G")
                const alice = keyring.addFromUri('//Alice', {name: 'Alice default'})

                const bid = api.createType('BusinessIdentifier', [cid, alice.publicKey]);
                // @ts-ignore
                const result = await api.rpc.bazaar.getOfferingsForBusiness(bid);
                // console.log(result);
                expect(result.length).toBe(0);
            });
        });
    });
});

function _registerTestCommunity(api: ApiPromise, signer: KeyringPair): Promise<ISubmitAndWatchResult> {
    const loc_json = testCommunityParams.locations[0]
    const location = api.createType('Location', {
        lat: stringToDegree(loc_json.lat),
        lon: stringToDegree(loc_json.lon),
    });

    const meta = api.createType('CommunityMetadataType', testCommunityParams.meta);
    const bootstrappers = api.createType('Vec<AccountId>', testCommunityParams.bootstrappers);

    // (location, bootstrappers, metadata, demurrage, nominal_income)
    const params = [location, bootstrappers, meta, null, null];

    const tx = api.tx.encointerCommunities.newCommunity(...params);

    return submitAndWatchTx(api, signer, tx);
}

async function registerAliceBobCharlieAndGoToAttesting(api: ApiPromise, cid: CommunityIdentifier): Promise<void> {

    const keyring = new Keyring({type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice', {name: 'Alice default'});
    const bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
    const charlie = keyring.addFromUri('//Charlie', {name: 'Charlie default'});

    // Even though they are identical, we need to have three different objects because they are passed by reference in JS.
    const tx1 = api.tx.encointerCeremonies.registerParticipant(cid, null)
    const tx2 = api.tx.encointerCeremonies.registerParticipant(cid, null)
    const tx3 = api.tx.encointerCeremonies.registerParticipant(cid, null)

    // Charlie does not have funds
    const transfer_tx = api.tx.balances.transfer(charlie.address, 10000000000000);
    await submitAndWatchTx(api, alice, transfer_tx)
        .then((result) => {
            if (result.error !== undefined) {
                console.log(`failed fund Charlie: ${JSON.stringify(result)}`);
            }
        })

    let results = await Promise.all([
        submitAndWatchTx(api, alice, tx1),
        submitAndWatchTx(api, bob, tx2),
        submitAndWatchTx(api, charlie, tx3),
    ])

    const signers = [alice, bob, charlie];
    results.forEach((result, index) => {
        if (result.error !== undefined) {
            console.log(`failed register ${signers[index].address}: ${JSON.stringify(result)}`);
        } else {
            console.log(`registered ${signers[index].address}: result: ${JSON.stringify(result)}`);
        }
    })

    // go to assigning phase
    await nextPhase(api, alice);

    // go to attesting phase
    await nextPhase(api, alice);
}

function nextPhase(api: ApiPromise, signer: KeyringPair): Promise<void> {
    const tx = api.tx.encointerScheduler.nextPhase()
    return submitAndWatchTx(api, signer, tx)
        .then((result) => {
            if (result.error !== undefined) {
                console.log(`failed to go to next phase: ${JSON.stringify(result)}`);
            }
        });
}

// Corresponds the community of the encointer-node repository
const testCommunityParams = {
    meta: {
        "name": "Mediterranea",
        "symbol": "MTA",
        "icons": "QmP2fzfikh7VqTu8pvzd2G2vAd4eK7EaazXTEgqGN6AWoD"
    },
    cid: "sqm1v79dF6b",
    bootstrappers: [
        "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
        "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
        "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
        "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL"
    ],
    locations: [
        {
            lon: "18.543548583984375",
            lat: "35.4841563798531700047"
        },
        {
            lon: "18.40484619140625",
            lat: "35.480801595828616"
        },
        {
            lon: "18.40621948242187",
            lat: "35.357696204467516"
        },
        {
            lon: "18.544921875",
            lat: "35.35993616287676"
        },
        {
            lon: "18.68087768554687",
            lat: "35.48751102385376"
        },
        {
            lon: "18.689117431640625",
            lat: "35.37001520672124"
        },
        {
            lon: "18.4075927734375",
            lat: "35.232159412017154"
        },
        {
            lon: "18.551788330078125",
            lat: "35.238889532322595"
        },
        {
            lon: "18.700103759765625",
            lat: "35.24898366572645"
        },
    ]
}
