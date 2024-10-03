import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { paseoNetwork} from './testUtils/networks.js';
import { IntegriteeWorker } from './integriteeWorker.js';
import WS from 'websocket';
import {type KeyringPair} from "@polkadot/keyring/types";

const {w3cwebsocket: WebSocket} = WS;

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
            types: network.customTypes,
            // @ts-ignore
            createWebSocket: (url) => new WebSocket(
                url,
                undefined,
                undefined,
                undefined,
                // Allow the worker's self-signed certificate
                { rejectUnauthorized: false }
            ),
            api: null,
        });
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

        describe('getBalance', () => {
            it('should return value', async () => {
                const result = await worker.getBalance(charlie, network.mrenclave);
                console.log('getBalance toNumber:', result.toString(10));
                expect(result).toBeDefined();
            });
        });

        describe('getBalanceGetter', () => {
            it('should return value', async () => {
                const getter = await worker.getBalanceGetter(charlie, network.mrenclave);
                console.log(`BalanceGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('getBalance toNumber:', result.toString(10));
                expect(result).toBeDefined();
            });
        });

        describe('getNonce', () => {
            it('should return value', async () => {
                const result = await worker.getNonce(alice, network.mrenclave);
                console.log('getNonce', result);
                expect(result).toBeDefined();
            });
        });

        describe('getNonceGetter', () => {
            it('should return value', async () => {
                const getter = await worker.getNonceGetter(charlie, network.mrenclave);
                console.log(`NonceGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('getNonce', result);
                expect(result).toBeDefined();
            });
        });

        describe('balance transfer should work', () => {
            it('should return value', async () => {
                const shard = network.chosenCid;
                const result = await worker.trustedBalanceTransfer(
                    alice,
                    shard,
                    network.mrenclave,
                    alice.address,
                    charlie.address,
                    1100000000000
                );
                console.log('balance transfer result', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('balance unshield should work', () => {
            it('should return value', async () => {
                const shard = network.chosenCid;

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
            });
        });
    });
});
