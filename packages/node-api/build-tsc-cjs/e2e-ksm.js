"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@polkadot/api");
const options_js_1 = require("@encointer/node-api/options.js");
const index_js_1 = require("@encointer/util/index.js");
const index_js_2 = require("@encointer/types/index.js");
const util_crypto_1 = require("@polkadot/util-crypto");
const encointer_api_js_1 = require("./encointer-api.js");
describe('node-api', () => {
    let api;
    let cidLeu;
    const chain = 'ws://127.0.0.1:9944';
    beforeAll(async () => {
        await (0, util_crypto_1.cryptoWaitReady)();
        const provider = new api_1.WsProvider('wss://kusama.api.encointer.org');
        try {
            api = await api_1.ApiPromise.create({
                ...(0, options_js_1.options)(),
                provider: provider
            });
            console.log(`${chain} wss connected success`);
            console.log(`rpc-methods ${await api.rpc.rpc.methods()}`);
        }
        catch (err) {
            console.log(`connect ${chain} failed`);
            await provider.disconnect();
        }
        cidLeu = (0, index_js_1.communityIdentifierFromString)(api.registry, "u0qj944rhWE");
    }, 80000);
    afterAll(async () => {
        // Jest fails to exit after the tests without this.
        await api.disconnect();
    });
    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query['encointerScheduler']['currentPhase']();
            expect(result).toBeDefined();
        });
        it('should getMeetupTimeWithOffset', async () => {
            // @ts-ignore
            const locationsRpc = await api.rpc.encointer.getLocations(cidLeu);
            const location = api.createType("Location", {
                lat: (0, index_js_2.stringToDegree)(locationsRpc[0].lat),
                lon: (0, index_js_2.stringToDegree)(locationsRpc[0].lon),
            });
            const time = await (0, encointer_api_js_1.getNextMeetupTime)(api, location);
            const dateTime = new Date(time.toNumber());
            console.log(`datetime: ${dateTime.toLocaleTimeString("en-US")}`);
        });
    });
    describe('ceremonies', () => {
        it('should get meetupTimeOffset', async () => {
            const time = await (0, encointer_api_js_1.getMeetupTimeOffset)(api);
            expect(time.toNumber()).toBe(-2100000);
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
