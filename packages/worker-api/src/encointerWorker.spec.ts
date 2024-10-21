import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { localDockerNetwork } from './testUtils/networks.js';
import { EncointerWorker } from './encointerWorker.js';
import WS from 'websocket';

const {w3cwebsocket: WebSocket} = WS;

describe('worker', () => {
    const network = localDockerNetwork();
    let keyring: Keyring;
    let worker: EncointerWorker;
    // let alice: KeyringPair;
    // let charlie: KeyringPair;
    beforeAll(async () => {
        jest.setTimeout(90000);
        await cryptoWaitReady();
        keyring = new Keyring({type: 'sr25519'});
        // alice = keyring.addFromUri('//Alice', {name: 'Alice default'});
        // charlie = keyring.addFromUri('//Charlie', {name: 'Bob default'});

        worker = new EncointerWorker(network.worker, {
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
    describe.skip('needs worker and node running', () => {
        // Tests specific for the encointer protocol
        describe('encointer-worker', () => {
            describe('getTotalIssuance', () => {
                it('should return value', async () => {
                    const result = await worker.getTotalIssuance(network.chosenCid);
                    // console.debug('getTotalIssuance', result);
                    expect(result).toBeDefined();
                });
            });

            describe('getParticipantCount', () => {
                it('should return default value', async () => {
                    const result = await worker.getParticipantCount(network.chosenCid);
                    expect(result).toBe(0);
                });
            });

            describe('getMeetupCount', () => {
                it('should return default value', async () => {
                    const result = await worker.getMeetupCount(network.chosenCid);
                    expect(result).toBe(0);
                });
            });

            describe('getCeremonyReward', () => {
                it('should return default value', async () => {
                    const result = await worker.getCeremonyReward(network.chosenCid);
                    expect(result).toBe(1);
                });
            });

            describe('getLocationTolerance', () => {
                it('should return default value', async () => {
                    const result = await worker.getLocationTolerance(network.chosenCid);
                    expect(result).toBe(1000);
                });
            });

            describe('getTimeTolerance', () => {
                it('should return default value', async () => {
                    const result = await worker.getTimeTolerance(network.chosenCid);
                    expect(result.toNumber()).toBe(600000);
                });
            });

            describe('getSchedulerState', () => {
                it('should return value', async () => {
                    const result = await worker.getSchedulerState(network.chosenCid);
                    // console.debug('schedulerStateResult', result);
                    expect(result).toBeDefined();
                });
            });

            describe('getRegistration', () => {
                it('should return default value', async () => {
                    await cryptoWaitReady();
                    const bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
                    const result = await worker.getParticipantIndex(bob, network.chosenCid);
                    expect(result.toNumber()).toBe(0);
                });
            });

            describe('getMeetupIndex', () => {
                it('should return default value', async () => {
                    await cryptoWaitReady();
                    const bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
                    const result = await worker.getMeetupIndex(bob, network.chosenCid);
                    expect(result.toNumber()).toBe(0);
                });
            });

            describe('getAttestations', () => {
                it('should be empty', async () => {
                    await cryptoWaitReady();
                    const bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
                    const result = await worker.getAttestations(bob, network.chosenCid);
                    expect(result.toJSON()).toStrictEqual([]);
                });
            });

            describe('getMeetupRegistry method', () => {
                it('should be empty', async () => {
                    await cryptoWaitReady();
                    const bob = keyring.addFromUri('//Bob', {name: 'Bob default'});
                    const result = await worker.getMeetupRegistry(bob, network.chosenCid);
                    expect(result.toJSON()).toStrictEqual([]);
                });
            });
        });
    });
});
