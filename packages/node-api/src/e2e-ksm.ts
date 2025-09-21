import {ApiPromise, WsProvider} from '@polkadot/api';
import {options} from "@encointer/node-api/options";
import {communityIdentifierFromString} from "@encointer/util";
import type {
    CeremonyPhaseType,
    CommunityIdentifier,
    Location,
} from "@encointer/types";
import {stringToDegree} from '@encointer/types';
import {cryptoWaitReady} from "@polkadot/util-crypto";
import {
    getMeetupTimeOffset,
    getNextMeetupTime,
} from './ceremony-api.js';
import {getBusinesses} from './bazaar-api.js';

describe('node-api', () => {
    let api: ApiPromise;
    let cidLeu: CommunityIdentifier;

    const chain = 'wss://kusama.api.encointer.org';
    beforeAll(async () => {
        await cryptoWaitReady();

        const provider = new WsProvider(chain);
        try {
            api = await ApiPromise.create({
                ...options(),
                provider: provider
            });
            console.log(`${chain} wss connected success`);
            console.log(
                `rpc-methods ${await api.rpc.rpc.methods()}`
            );
        } catch (err) {
            console.log(`connect ${chain} failed`);
            await provider.disconnect();
        }

        cidLeu = communityIdentifierFromString(api.registry, "u0qj944rhWE")
    }, 80000);

    afterAll(async () => {
        // Jest fails to exit after the tests without this.
        await api.disconnect();
    });

    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query['encointerScheduler']['currentPhase']<CeremonyPhaseType>();
            expect(result).toBeDefined();
        });

        it('should getMeetupTimeWithOffset', async () => {
            // @ts-ignore
            const locationsRpc = await api.rpc.encointer.getLocations(cidLeu);

            const location = api.createType<Location>("Location", {
                lat: stringToDegree(locationsRpc[0].lat),
                lon: stringToDegree(locationsRpc[0].lon),
            })

            const time = await getNextMeetupTime(api, location);
            const dateTime = new Date(time.toNumber())

            console.log(`datetime: ${dateTime.toLocaleTimeString("en-US")}`);
        });
    });

    describe('ceremonies', () => {
        it('should get meetupTimeOffset', async () => {
            const time = await getMeetupTimeOffset(api);
            expect(time.toNumber()).toBe(16500000);
        });
    });

    describe('bazaar-api', () => {
        it('bazaar.GetBusinesses should return 1 business', async () => {
            // @ts-ignore
            const result = await getBusinesses(api, cidLeu);
            expect(result.length).toBe(1);
            console.log("BusinessResult", result.toHuman());

            let business = api.createType("Business", {
                controller: "CcZpQp6RdZiHzuEqdyiQJqHUvJsN13QPY113UGyEQgeYeDn",
                businessData: {
                    url: "Qmb3mRYRK6nwf3MXULPRHAQHAfkGs38UJ7voXLPN9gngqa",
                    lastOid: 1
                }
            });
            expect(result.pop()!.toHuman()).toStrictEqual(business.toHuman());
        });
    });

    describe('rpc', () => {
        // These tests predominantly verify that we have correct rpc/type definitions
        describe('encointer', () => {
            it('encointer.GetAllCommunities should return LEU community', async () => {
                // @ts-ignore
                const cidNames = await api.rpc.encointer.getAllCommunities();
                expect(cidNames[0].cid).toStrictEqual(cidLeu);
            });
        });

        it('bazaar.GetBusinesses should return 1 business', async () => {
            // @ts-ignore
            const result = await api.rpc.encointer.bazaarGetBusinesses(cidLeu);
            expect(result.length).toBe(1);
            console.log(result.toHuman());
            // expect(result[0]).toStrictEqual({ controller: "", url: "..."});
        });

        it('bazaar.GetOfferings should return 0 offerings', async () => {
            // @ts-ignore
            const result = await api.rpc.encointer.bazaarGetOfferings(cidLeu);
            expect(result.length).toBe(0);
            console.log(result.toHuman());
            // expect(result[0]).toStrictEqual({ controller: "", url: "..."});
        });
    });
});


