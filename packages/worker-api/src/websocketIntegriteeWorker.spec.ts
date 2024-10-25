import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {paseoNetwork} from './testUtils/networks.js';
import { IntegriteeWorker } from './websocketIntegriteeWorker.js';
import {type KeyringPair} from "@polkadot/keyring/types";

describe('worker', () => {
    const network = paseoNetwork();
    let keyring: Keyring;
    let worker: IntegriteeWorker;
    let alice: KeyringPair;
    let charlie: KeyringPair;
    beforeAll(async () => {
        jest.setTimeout(90000);
        await cryptoWaitReady();
        keyring = new Keyring({type: 'sr25519'});
        alice = keyring.addFromUri('//Alice', {name: 'Alice default'});
        charlie = keyring.addFromUri('//Charlie', {name: 'Bob default'});

        worker = new IntegriteeWorker(network.worker, {
            keyring: keyring,
        });
    });

    afterAll(async () => {
        await worker.closeWs()
    });


    // skip it, as this requires a worker (and hence a node) to be running
    // To my knowledge jest does not have an option to run skipped tests specifically, does it?
    // Todo: add proper CI to test this too.
    describe('needs worker and node running', () => {
        describe('getWorkerPubKey', () => {
            it('should return value', async () => {
                const result = await worker.getShieldingKey();
                // console.log('Shielding Key', result);
                expect(result).toBeDefined();
            });
        });

        describe('getShardVault', () => {
            it('should return value', async () => {
                const result = await worker.getShardVault();
                console.log('ShardVault', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('getNonce', () => {
            it('should return value', async () => {
                const result = await worker.getNonce(alice, network.shard);
                console.log(`Nonce: ${JSON.stringify(result)}`);
                expect(result).toBeDefined();
            });
        });


        describe('getAccountInfo', () => {
            it('should return value', async () => {
                const result = await worker.getAccountInfo(alice, network.shard);
                console.log(`getAccountInfo: ${JSON.stringify(result)}`);
                expect(result).toBeDefined();
            });
        });

        describe('accountInfoGetter', () => {
            it('should return value', async () => {
                const getter = await worker.accountInfoGetter(charlie, network.shard);
                console.log(`AccountInfoGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log(`getAccountInfo: ${JSON.stringify(result)}`);
                expect(result).toBeDefined();
            });
        });


        describe('balance unshield should work', () => {
            it('should return value', async () => {
                const shard = network.shard;

                const result = await worker.balanceUnshieldFunds(
                    alice,
                    shard,
                    network.mrenclave,
                    alice.address,
                    charlie.address,
                    1100000000000,
                );
                console.log('balance unshield result', result.toHuman());
                expect(result).toBeDefined();
            }, 20000);
        });
    });
});
