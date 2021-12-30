import {ApiPromise, Keyring, WsProvider} from '@polkadot/api';
import {options} from "@encointer/node-api/options";
import {communityIdentifierFromString} from "../../util/src";
import {stringToDegree} from "../../types/src";
import {cryptoWaitReady} from "@polkadot/util-crypto";
import {Keypair} from "@polkadot/util-crypto/types";
import {Hash} from "@polkadot/types/interfaces";

// Corresponds the community of in the encointer-node
const newCommunityParams = {
    meta: {
        "name": "Mediterranea",
        "symbol": "MTA",
        "icons": "QmP2fzfikh7VqTu8pvzd2G2vAd4eK7EaazXTEgqGN6AWoD"
    },
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

        const res = await _registerCommunity(api, alice);

        console.log(`result: ${JSON.stringify(res)}`);
    });

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

function _registerCommunity(api: ApiPromise, signer: Keypair): Promise<Hash> {
    return new Promise((resolve) => {
        let unsub = () => {};

        const loc_json = newCommunityParams.locations[0]
        const location = api.createType('Location', {
            lat: stringToDegree(loc_json.lat),
            lon: stringToDegree(loc_json.lon),
        });

        const meta = api.createType('CommunityMetadataType', newCommunityParams.meta);
        const bootstrappers = api.createType('Vec<AccountId>', newCommunityParams.bootstrappers);

        // (location, bootstrappers, metadata, demurrage, nominal_income)
        const params = [location, bootstrappers, meta, null, null];

        const tx = api.tx.encointerCommunities.newCommunity(...params);

        const onStatusChange = (result) => {
            if (result.status.isInBlock || result.status.isFinalized) {
                const {success, error} = _extractEvents(api, result);
                if (success) {
                    resolve({
                        hash: tx.hash.toString(),
                        time: new Date().getTime(),
                        params: params
                    });
                }
                if (error) {
                    resolve({error});
                }
                unsub();
            } else {
                console.log('txStatusChange', result.status.type)
            }
        }

        tx.signAndSend(signer, {}, onStatusChange)
            .then((res) => {
                unsub = res;
            })
            .catch((err) => {
                console.log(`{error: ${err.message}}`);
            });
    });
}

function _extractEvents(api: ApiPromise, result) {
    if (!result || !result.events) {
        return;
    }

    let success = false;
    let error;
    result.events
        .filter((event) => !!event.event)
        .map(({event: {data, method, section}}) => {
            if (section === 'system' && method === 'ExtrinsicFailed') {
                const [dispatchError] = data;
                let message = dispatchError.type;

                if (dispatchError.isModule) {
                    try {
                        const mod = dispatchError.asModule;
                        const error = api.registry.findMetaError(
                            new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
                        );

                        message = `${error.section}.${error.name}`;
                    } catch (error) {
                        // swallow error
                    }
                }
                console.log('txUpdateEvent', {
                    title: `${section}.${method}`,
                    message
                });
                error = message;
            } else {
                console.log('txUpdateEvent', {
                    title: `${section}.${method}`,
                    message: 'ok'
                });
                if (section == 'system' && method == 'ExtrinsicSuccess') {
                    success = true;
                }
            }
        });
    return {success, error};
}
