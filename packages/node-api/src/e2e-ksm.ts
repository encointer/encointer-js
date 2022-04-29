import {ApiPromise, WsProvider} from '@polkadot/api';
import {options} from "@encointer/node-api/options";
import {communityIdentifierFromString} from "../../util/src";
import {
    CeremonyPhaseType,
    CommunityIdentifier, stringToDegree,
} from "../../types/src";
import {cryptoWaitReady} from "@polkadot/util-crypto";
import {
    getStartOfAttestingPhase,
    getMeetupTimeOffset, getNextMeetupTime,
} from './encointer-api';
import {Moment} from "@polkadot/types/interfaces/runtime";

describe('node-api', () => {
    let api: ApiPromise;
    let cidLeu: CommunityIdentifier;

    const chain = 'ws://127.0.0.1:9944';
    beforeAll(async () => {
        await cryptoWaitReady();

        const provider = new WsProvider('wss://kusama.api.encointer.org');
        try {
            api = await ApiPromise.create({
                ...options(),
                provider: provider
            });
            console.log(`${chain} wss connected success`);
            console.log(
                `rpc-methods ${await  api.rpc.rpc.methods()}`
            );
        } catch (err) {
            console.log(`connect ${chain} failed`);
            await provider.disconnect();
        }

        cidLeu = communityIdentifierFromString(api.registry, "u0qj92QX9PQ")
    }, 80000);

    afterAll(async () => {
        // Jest fails to exit after the tests without this.
        await api.disconnect();
    });

    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query.encointerScheduler.currentPhase<CeremonyPhaseType>();
            expect(result).toBeDefined();
        });

        it('should getAttestingStart', async () => {
            const [attestingStart, nextPhase, assigningDuration] = await Promise.all([
                getStartOfAttestingPhase(api),
                api.query.encointerScheduler.nextPhaseTimestamp<Moment>(),
                api.query.encointerScheduler.phaseDurations<Moment>('Assigning')
            ]);

            expect(attestingStart.toNumber()).toBe(nextPhase.toNumber() + assigningDuration.toNumber());
        });

        it('should getMeetupTimeWithOffset', async () => {
            // @ts-ignore
            const locationsRpc = await api.rpc.encointer.getLocations(cidLeu);

            const location = api.createType("Location", {
                lat: stringToDegree(locationsRpc[0].lat),
                lon: stringToDegree(locationsRpc[0].lon),
            })

            const time = await getNextMeetupTime(api, location);
            const dateTime = new Date(time.toNumber())

            // prints 13.08 CET normally.
            // prints 13.25 CET if we artificially set the meetupOffset to 0.
            console.log(`datetime: ${dateTime.toLocaleTimeString("en-US")}`);
        });
    });

    describe('ceremonies', () => {
        it('should get meetupTimeOffset', async () => {
            const time = await getMeetupTimeOffset(api);
            expect(time.toNumber()).toBe(-1_020_000);
        });
    });

    describe('rpc', () => {
        // These tests predominantly verify that we have correct rpc/type definitions
        describe('encointer', () => {
            it('encointer.GetAllCommunities should return empty vec', async () => {
                // @ts-ignore
                const cidNames = await api.rpc.encointer.getAllCommunities();
                expect(cidNames[0].cid).toStrictEqual(cidLeu);
            });
        });
    });
});


