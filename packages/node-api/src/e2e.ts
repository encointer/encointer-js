import {ApiPromise, WsProvider} from '@polkadot/api';
import {options} from "@encointer/node-api/options";

describe('node-api', () => {
    // let keyring: Keyring;
    let api: ApiPromise;
    const chain = 'ws://127.0.0.1:9944';
    beforeAll(async () => {
        jest.setTimeout(90000);
        // keyring = new Keyring({ type: 'sr25519' });
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
    });
    describe('scheduler', () => {
        it('CurrentPhase should return promise', async () => {
            const result = await api.query.encointerScheduler.currentPhase();
            console.log(result);
            expect(result).toBeDefined();
        });
    });
});
