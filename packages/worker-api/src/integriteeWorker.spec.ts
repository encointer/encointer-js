import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { localDockerNetwork } from './testUtils/networks.js';
import { IntegriteeWorker } from './integriteeWorker.js';
import WS from 'websocket';
import {KeyringPair} from "@polkadot/keyring/types";
import bs58 from "bs58";

const {w3cwebsocket: WebSocket} = WS;

describe('worker', () => {
    const network = localDockerNetwork();
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

        describe('getNonce', () => {
            it('should return value', async () => {
                const result = await worker.getNonce(alice, network.mrenclave);
                console.log('getNonce', result);
                expect(result).toBeDefined();
            });
        });

        describe('balance transfer should work', () => {
            it('should return value', async () => {
                const shard = worker.createType('ShardIdentifier', bs58.decode(network.mrenclave));
                const params = worker.createType('BalanceTransferArgs', [alice.address, charlie.address, 1100000000000])
                const result = await worker.trustedBalanceTransfer(alice, shard, network.mrenclave, params);
                console.log('balance transfer result', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('balance unshield should work', () => {
            it('should return value', async () => {
                const shard = worker.createType('ShardIdentifier', bs58.decode(network.mrenclave));
                const params = worker.createType('BalanceUnshieldArgs', [alice.address, charlie.address, 1100000000000, shard])
                const result = await worker.balanceUnshieldFunds(alice, shard, network.mrenclave, params);
                console.log('balance unshield result', result.toHuman());
                expect(result).toBeDefined();
            });
        });
    });
});
