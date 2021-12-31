import {ApiPromise, Keyring, WsProvider} from '@polkadot/api';
import {options} from "@encointer/node-api/options";
import {communityIdentifierFromString} from "../../util/src";
import {CommunityIdentifier, stringToDegree} from "../../types/src";
import {cryptoWaitReady} from "@polkadot/util-crypto";

import {submitAndWatchTx} from "./tx";
import {ISubmitAndWatchResult} from "./interface";
import {KeyringPair} from "@polkadot/keyring/types";

describe('node-api', () => {
    let keyring: Keyring;
    let api: any;
    const chain = 'ws://127.0.0.1:9944';
    beforeAll(async () => {
        await cryptoWaitReady();

        keyring = new Keyring({type: 'sr25519'});
        const alice = keyring.addFromUri('//Alice', {name: 'Alice default'});

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

        await registerAliceBobCharlieAndGoToAttesting(api, communityIdentifierFromString(api.registry, testCommunityParams.cid))

    }, 40000);

    afterAll(async () => {
        // Jest fails to exit after the tests without this.
        api.disconnect();
    });

    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query.encointerScheduler.currentPhase();
            // console.log(result);
            expect(result).toBeDefined();
        });
    });

    describe('rpc', () => {
        // These tests predominantly verify that we have correct rpc/type definitions
        describe('communities', () => {
            it('communities.GetAll should return empty vec', async () => {
                const result = await api.rpc.communities.getAll();
                // console.log(result);
                expect(result.length).toBe(0);
            });

            it('communities.getLocations should return error on unknown community', async () => {
                let cid = communityIdentifierFromString(api.registry, "gbsuv7YXq9G")

                try {
                    await api.rpc.communities.getLocations(cid)
                } catch (e) {
                    expect(e.toString()).toBe("Error: 3: Offchain storage not found: Key [99, 105, 100, 115, 103, 98, 115, 117, 118, 255, 255, 255, 255]");
                }

            });
            // Todo: register a community in the integration tests so we do better tests:
            // https://github.com/encointer/encointer-js/issues/31
            it.skip('communities.getLocations should get locations', async () => {
                let cid = communityIdentifierFromString(api.registry, "sqm1v79dF6b")

                let loc = await api.rpc.communities.getLocations(cid)

                console.log(loc[0].toJSON())

            });
        });

        describe('bazaar', () => {
            it('bazaar.GetBusinesses should return empty vec', async () => {
                const cid = api.createType('CommunityIdentifier', {
                    geohash: [0x00, 0x00, 0x00, 0x00, 0x00],
                    digest: [0x00, 0x00, 0x00, 0x00,],
                });

                const result = await api.rpc.bazaar.getBusinesses(cid.toHex());
                // console.log(result);
                expect(result.length).toBe(0);
            });

            it('bazaar.GetOfferings should return empty vec', async () => {
                // random cid
                let cid = communityIdentifierFromString(api.registry, "gbsuv7YXq9G")
                const result = await api.rpc.bazaar.getOfferings(cid);
                // console.log(result);
                expect(result.length).toBe(0);
            });

            it('bazaar.GetOfferingsForBusiness should return empty vec', async () => {
                // random cid
                let cid = communityIdentifierFromString(api.registry, "gbsuv7YXq9G")
                const alice = keyring.addFromUri('//Alice', {name: 'Alice default'})

                const bid = api.createType('BusinessIdentifier', [cid, alice.publicKey]);
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

    const tx = api.tx.encointerCeremonies.registerParticipant(cid, null)

    const keyring = new Keyring({type: 'sr25519'});
    const alice = keyring.addFromUri('//Alice', {name: 'Alice default'});
    const bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
    const charlie = keyring.addFromUri('//Charlie', {name: 'Charlie default'});

    // Charlie does not have funds
    const transfer_tx = api.tx.balances.transfer(charlie.address, 10000000000000);
    await submitAndWatchTx(api, alice, transfer_tx)
        .then((result) => {
            if (result.error !== undefined) {
                console.log(`failed fund Charlie: ${JSON.stringify(result)}`);
            }
        })

    let results = await Promise.all([
        submitAndWatchTx(api, alice, tx),
        submitAndWatchTx(api, bob, tx),
        submitAndWatchTx(api, charlie, tx),
    ])

    const signers = [alice, bob, charlie];
    results.forEach((result, index) => {
        if (result.error !== undefined) {
            console.log(`failed register ${signers[index]}: ${JSON.stringify(result)}`);
        }
    })


    // go to assigning phase
    await nextPhase(api, alice)
        .then((result) => {
            if (result.error !== undefined) {
                console.log(`failed to go to next phase: ${JSON.stringify(result)}`);
            }
        });

    // go to attesting phase
    await nextPhase(api, alice)
        .then((result) => {
            if (result.error !== undefined) {
                console.log(`failed to go to next phase: ${JSON.stringify(result)}`);
            }
        });
}

function nextPhase(api: ApiPromise, signer: KeyringPair): Promise<ISubmitAndWatchResult> {
    const tx = api.tx.encointerScheduler.nextPhase()
    return submitAndWatchTx(api, signer, tx);
}

// Corresponds the community of in the encointer-node
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
            lat: "35.48415637985317"
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
