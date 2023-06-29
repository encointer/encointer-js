"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
const options_1 = require("@encointer/node-api/options");
const src_1 = require("../../util/src");
const src_2 = require("../../types/src");
const util_crypto_1 = require("@polkadot/util-crypto");
const tx_1 = require("./tx");
const encointer_api_1 = require("./encointer-api");
describe('node-api', () => {
    let keyring;
    let api;
    let cidMTA;
    let testCIndex;
    let testMeetupIndex;
    // let cidEDI: CommunityIdentifier;
    let alice;
    let bob;
    let charlie;
    const chain = 'ws://127.0.0.1:9944';
    beforeAll(async () => {
        await (0, util_crypto_1.cryptoWaitReady)();
        keyring = new api_1.Keyring({ type: 'sr25519' });
        alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
        bob = keyring.addFromUri('//Bob', { name: 'Bob default' });
        charlie = keyring.addFromUri('//Charlie', { name: 'Charlie default' });
        const provider = new api_1.WsProvider('ws://127.0.0.1:9944');
        try {
            api = await api_1.ApiPromise.create({
                ...(0, options_1.options)(),
                provider: provider
            });
            console.log(`${chain} wss connected success`);
            console.log(`rpc-methods ${await api.rpc.rpc.methods()}`);
        }
        catch (err) {
            console.log(`connect ${chain} failed`);
            await provider.disconnect();
        }
        let res = await registerTestCommunity(api, alice);
        if (res.error !== undefined) {
            console.log(`failed to register test community: ${JSON.stringify(res)}`);
        }
        cidMTA = (0, src_1.communityIdentifierFromString)(api.registry, testCommunityParams.cid);
        testCIndex = api.createType('CeremonyIndexType', 1);
        testMeetupIndex = api.createType('MeetupIndexType', 1);
        // cidEDI = communityIdentifierFromString(api.registry, edisonPaulaCommunity.cid)
        await registerAliceBobCharlieAndGoToAttesting(api, cidMTA);
    }, 80000);
    afterAll(async () => {
        // Jest fails to exit after the tests without this.
        await api.disconnect();
    });
    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query['encointerScheduler']['currentPhase']();
            expect(result.isAttesting);
        });
        it('should getAttestingStart', async () => {
            const [attestingStart, nextPhase, attestingDuration] = await Promise.all([
                (0, encointer_api_1.getStartOfAttestingPhase)(api),
                api.query['encointerScheduler']['nextPhaseTimestamp'](),
                api.query['encointerScheduler']['phaseDurations']('Attesting')
            ]);
            expect(attestingStart.toNumber()).toBe(nextPhase.toNumber() - attestingDuration.toNumber());
        });
        it("should parse DispatchErrors correcly", async () => {
            const tx = api.tx['sudo']['sudo'](api.tx['encointerScheduler']['nextPhase']());
            const bob = keyring.addFromUri("//Bob", { name: "Bob default" });
            // this will fail because Bob is no sudoer
            let result = await (0, tx_1.submitAndWatchTx)(api, bob, tx);
            if (result.error !== undefined) {
                expect(result.error).toEqual("sudo.RequireSudo");
            }
        }, 80000);
    });
    describe('assignment', () => {
        it('should get assignmentCount', async () => {
            const result = await (0, encointer_api_1.getAssignmentCount)(api, cidMTA, testCIndex);
            expect(result.toJSON()).toStrictEqual({
                "bootstrappers": 3,
                "endorsees": 0,
                "newbies": 0,
                "reputables": 0,
            });
        });
        it('should get assignment', async () => {
            const assignment = await (0, encointer_api_1.getAssignment)(api, cidMTA, testCIndex);
            // hard to test as it is randomized.
            expect(assignment.bootstrappersReputables.m.toNumber()).toBe(3);
            expect(assignment.bootstrappersReputables.s1.toNumber()).toBeLessThan(3);
            expect(assignment.bootstrappersReputables.s2.toNumber()).toBeLessThan(3);
            // no endorsees and newbies assigned
            expect(assignment.endorsees.toJSON()).toStrictEqual({ "m": 2, "s1": 1, "s2": 1 });
            expect(assignment.newbies.toJSON()).toStrictEqual({ "m": 2, "s1": 1, "s2": 1 });
        });
        it('should get meetupCount', async () => {
            const result = await (0, encointer_api_1.getMeetupCount)(api, cidMTA, testCIndex);
            expect(result.toNumber()).toBe(1);
        });
        it('should get meetupIndex', async () => {
            for (const participant of [alice, bob, charlie]) {
                const assignment = await (0, encointer_api_1.getMeetupIndex)(api, cidMTA, testCIndex, participant.address);
                expect(assignment.toNumber()).toBe(1);
            }
        });
        it('should get meetupTimeOffset', async () => {
            const time = await (0, encointer_api_1.getMeetupTimeOffset)(api);
            expect(time.toNumber()).toBeDefined();
        });
        it('should get meetupLocation', async () => {
            const location = await (0, encointer_api_1.getMeetupLocation)(api, cidMTA, testCIndex, testMeetupIndex);
            expect(location.toJSON()).toStrictEqual(testCommunityParams.locations[0]);
        });
        it('should get meetupParticipants', async () => {
            // Todo: this test only covers bootstrappers. How do we test reputables, endorsees and newbies?
            // This might be too tedious, we'd need to go to the second ceremony and also register more participants.
            const participants = await (0, encointer_api_1.getMeetupParticipants)(api, cidMTA, testCIndex, testMeetupIndex);
            expect(participants.sort().toJSON())
                .toStrictEqual([alice.address, bob.address, charlie.address].sort());
        });
        it('should get participantIndex', async () => {
            for (const [i, participant] of [alice, bob, charlie].entries()) {
                const pIndex = await (0, encointer_api_1.getParticipantIndex)(api, cidMTA, testCIndex, participant.address);
                expect(pIndex.toNumber()).toBe(i + 1);
            }
        });
        it('should get participantRegistration', async () => {
            for (const [i, participant] of [alice, bob, charlie].entries()) {
                const pIndex = await (0, encointer_api_1.getParticipantRegistration)(api, cidMTA, testCIndex, participant.address);
                expect(pIndex.unwrap().toJSON()).toStrictEqual({ index: i + 1, registrationType: "Bootstrapper" });
            }
        });
        it('should get demurrage', async () => {
            // test community has default demurrage
            const demurrageDefault = await (0, encointer_api_1.getDemurrage)(api, cidMTA);
            expect(demurrageDefault.toJSON()).toStrictEqual(defaultDemurrage);
            // Todo setup integration tests against gesell.
            //
            // this community has custom demurrage
            // const demurrage = await getDemurrage(api, cidEDI)
            // expect(demurrage.toJSON()).toStrictEqual(edisonPaulaCommunity.demurrage);
        });
        it('should get ceremony income', async () => {
            // test community has default income
            const incomeDefault = await (0, encointer_api_1.getCeremonyIncome)(api, cidMTA);
            expect(incomeDefault.toBn().toString()).toEqual(defaultNominalIncome.toString());
            // Todo setup integration tests against gesell.
            //
            // this community has custom income
            // const demurrage = await getCeremonyIncome(api, cidEDI)
            // expect(demurrage.toBn().toString()).toEqual(edisonPaulaCommunity.ceremony_income.toString());
        });
    });
    describe('rpc', () => {
        // These tests predominantly verify that we have correct rpc/type definitions
        describe('encointer', () => {
            it('encointer.getReputations should return empty vec', async () => {
                // @ts-ignore
                const reputations = await api.rpc.encointer.getReputations(alice.address);
                // console.log(`Reputations: ${JSON.stringify(reputations)}`);
                expect(reputations.length).toBe(0);
            });
            it('encointer.GetAllCommunities should return empty vec', async () => {
                // @ts-ignore
                const cidNames = await api.rpc.encointer.getAllCommunities();
                expect(cidNames[0].cid).toStrictEqual(cidMTA);
            });
            it('encointer.getLocations should return error on unknown community', async () => {
                let cid = (0, src_1.communityIdentifierFromString)(api.registry, "gbsuv7YXq9G");
                try {
                    // @ts-ignore
                    await api.rpc.encointer.getLocations(cid);
                }
                catch (e) {
                    expect(e.toString()).toBe("RpcError: 3: Offchain storage not found: [99, 105, 100, 115, 103, 98, 115, 117, 118, 255, 255, 255, 255]");
                }
            });
            it('encointer.getAllBalances should return empty vec', async () => {
                // @ts-ignore
                const balances = await api.rpc.encointer.getAllBalances(alice.address);
                // console.log(`balances: ${JSON.stringify(balances)}`);
                expect(balances.length).toBe(0);
            });
        });
        describe('bazaar', () => {
            it('encointer.bazaarGetBusinesses should return empty vec', async () => {
                const cid = api.createType('CommunityIdentifier', {
                    geohash: [0x00, 0x00, 0x00, 0x00, 0x00],
                    digest: [0x00, 0x00, 0x00, 0x00,],
                });
                // @ts-ignore
                const result = await api.rpc.encointer.bazaarGetBusinesses(cid.toHex());
                // console.log(result);
                expect(result.length).toBe(0);
            });
            it('encointer.bazaarGetOfferings should return empty vec', async () => {
                // random cid
                let cid = (0, src_1.communityIdentifierFromString)(api.registry, "gbsuv7YXq9G");
                // @ts-ignore
                const result = await api.rpc.encointer.bazaarGetOfferings(cid);
                // console.log(result);
                expect(result.length).toBe(0);
            });
            it('encointer.bazaarGetOfferingsForBusiness should return empty vec', async () => {
                // random cid
                let cid = (0, src_1.communityIdentifierFromString)(api.registry, "gbsuv7YXq9G");
                const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
                const bid = api.createType('BusinessIdentifier', [cid, alice.publicKey]);
                // @ts-ignore
                const result = await api.rpc.encointer.bazaarGetOfferingsForBusiness(bid);
                // console.log(result);
                expect(result.length).toBe(0);
            });
        });
    });
});
function registerTestCommunity(api, signer) {
    const loc_json = testCommunityParams.locations[0];
    const location = api.createType('Location', {
        lat: (0, src_2.stringToDegree)(loc_json.lat),
        lon: (0, src_2.stringToDegree)(loc_json.lon),
    });
    const meta = api.createType('CommunityMetadataType', testCommunityParams.meta);
    const bootstrappers = api.createType('Vec<AccountId>', testCommunityParams.bootstrappers);
    // (location, bootstrappers, metadata, demurrage, nominal_income)
    const params = [location, bootstrappers, meta, null, null];
    const tx = api.tx['encointerCommunities']['newCommunity'](...params);
    return (0, tx_1.submitAndWatchTx)(api, signer, tx);
}
async function registerAliceBobCharlieAndGoToAttesting(api, cid) {
    const keyring = new api_1.Keyring({ type: 'sr25519' });
    const alice = keyring.addFromUri('//Alice', { name: 'Alice default' });
    const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });
    const charlie = keyring.addFromUri('//Charlie', { name: 'Charlie default' });
    // Even though they are identical, we need to have three different objects because they are passed by reference in JS.
    const tx1 = api.tx['encointerCeremonies']['registerParticipant'](cid, null);
    const tx2 = api.tx['encointerCeremonies']['registerParticipant'](cid, null);
    const tx3 = api.tx['encointerCeremonies']['registerParticipant'](cid, null);
    // Charlie does not have funds
    const transfer_tx = api.tx['balances']['transfer'](charlie.address, 10000000000000);
    await (0, tx_1.submitAndWatchTx)(api, alice, transfer_tx)
        .then((result) => {
        if (result.error !== undefined) {
            console.log(`failed fund Charlie: ${JSON.stringify(result)}`);
        }
    });
    let results = await Promise.all([
        (0, tx_1.submitAndWatchTx)(api, alice, tx1),
        (0, tx_1.submitAndWatchTx)(api, bob, tx2),
        (0, tx_1.submitAndWatchTx)(api, charlie, tx3),
    ]);
    const signers = [alice, bob, charlie];
    results.forEach((result, index) => {
        if (result.error !== undefined) {
            console.log(`failed register ${signers[index].address}: ${JSON.stringify(result)}`);
        }
        else {
            console.log(`registered ${signers[index].address}: result: ${JSON.stringify(result)}`);
        }
    });
    // go to assigning phase
    await nextPhase(api, alice);
    // go to attesting phase
    await nextPhase(api, alice);
}
function nextPhase(api, signer) {
    const tx = api.tx['sudo']['sudo'](api.tx['encointerScheduler']['nextPhase']());
    return (0, tx_1.submitAndWatchTx)(api, signer, tx)
        .then((result) => {
        if (result.error !== undefined) {
            console.log(`failed to go to next phase: ${JSON.stringify(result)}`);
        }
    });
}
const defaultDemurrage = 2078506789235;
const defaultNominalIncome = (0, src_2.stringToEncointerBalance)("1");
const testCommunityParams = {
    meta: {
        "name": "Mediterranea",
        "symbol": "MTA",
        "assets": "QmP2fzfikh7VqTu8pvzd2G2vAd4eK7EaazXTEgqGN6AWoD"
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
            // this is not the exact same value as in the encointer-node,
            // but the same value leads to different cid, due to ##35
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
};
