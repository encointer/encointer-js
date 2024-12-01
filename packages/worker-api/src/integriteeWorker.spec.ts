import { Keyring } from '@polkadot/api';
import {cryptoWaitReady, mnemonicToMiniSecret} from '@polkadot/util-crypto';
import {localDockerNetwork} from './testUtils/networks.js';
import { IntegriteeWorker } from './integriteeWorker.js';
import {type KeyringPair} from "@polkadot/keyring/types";

import WS from 'websocket';
import type {AccountInfo} from "@polkadot/types/interfaces/system";

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
            // @ts-ignore
            createWebSocket: (url) => new WebSocket(
                url,
                undefined,
                undefined,
                undefined,
                // Allow the worker's self-signed certificate
                { rejectUnauthorized: false }
            ),
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
                console.log('Nonce', result.toHuman);
                expect(result).toBeDefined();
            });
        });


        describe('getAccountInfo', () => {
            it('should return value', async () => {
                const result = await worker.getAccountInfo(alice, network.shard);
                console.log('getAccountInfo', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('accountInfoGetter', () => {
            it('should return value', async () => {
                const getter = await worker.accountInfoGetter(alice, network.shard);
                console.log(`AccountInfoGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('getAccountInfo:', result.toHuman());
                expect(result).toBeDefined();
                const info = result as AccountInfo;
                expect(info.data.free.toBigInt()).toBeGreaterThan(0);
            });

            it('should fall back to default if signed by unauthorized delegate', async () => {
                const getter = await worker.accountInfoGetter(alice, network.shard, { delegate: charlie });
                console.log(`AccountInfoGetter with unauthorized signature: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('getAccountInfo:', result.toHuman());
                expect(result).toBeDefined();
                const info = result as AccountInfo;
                console.log("parsed: ", info.data.free);
                // we don't forward errors here. instead, failures are mapped to default, which is zero
                expect(info.data.free.toBigInt()).toEqual(BigInt(0));
            });
        });

        describe('parentchainsInfoGetter', () => {
            it('should return value', async () => {
                const getter = worker.parentchainsInfoGetter(network.shard);
                console.log(`parentchainsInfoGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('parentchainsInfoGetter:', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('noteBucketsInfoGetter', () => {
            it('should return value', async () => {
                const getter = worker.noteBucketsInfoGetter(network.shard);
                console.log(`noteBucketsInfoGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('noteBucketsInfoGetter:', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('notesForTrustedGetter', () => {
            it('should return value', async () => {
                const getter = await worker.notesForTrustedGetter(alice, 0, network.shard);
                console.log(`notesForTrustedGetter: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('notesForTrustedGetter:', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('guessTheNumberInfoGetter', () => {
            it('should return value', async () => {
                const getter = worker.guessTheNumberInfoGetter(network.shard);
                console.log(`GuessTheNumberInfo: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('GuessTheNumberInfo:', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('guessTheNumberAttemptsGetter', () => {
            it('should return value', async () => {
                const getter = await worker.guessTheNumberAttemptsTrustedGetter(charlie, network.shard);
                console.log(`Attempts: ${JSON.stringify(getter)}`);
                const result = await getter.send();
                console.log('Attempts:', result.toHuman());
                expect(result).toBeDefined();
            });
        });

        describe('call signed by unauthorized delegate should fail', () => {
            it('should fail', async () => {
                const shard = network.shard;
                //const testNote = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678";
                const testNote = "My test note";
                const result = await worker.trustedBalanceTransfer(
                  alice,
                  shard,
                  network.mrenclave,
                  alice.address,
                  charlie.address,
                  1100000000000,
                  testNote,
                  { delegate: charlie}
                );
                console.log('balance transfer result', JSON.stringify(result));
                expect(result).toBeDefined();
                const status = worker.createType('TrustedOperationStatus', result.status);
                expect(status.isInvalid).toBeTruthy();
            });
        });

        describe.skip('should return note of the executed trusted call', () => {
            it('should return balance transfer with note as note', async () => {
                const shard = network.shard;
                //const testNote = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678";
                const testNote = "My test note";
                const result = await worker.trustedBalanceTransfer(
                    alice,
                    shard,
                    network.mrenclave,
                    alice.address,
                    charlie.address,
                    1100000000000,
                    testNote
                );
                console.log('balance transfer result', JSON.stringify(result));
                expect(result).toBeDefined();

                const getter = await worker.notesForTrustedGetter(alice, 0, network.shard);
                console.log(`notesForTrustedGetter: ${JSON.stringify(getter)}`);
                const notes = await getter.send();
                console.log('notesForTrustedGetter:', notes.toHuman());

                // equal to 1 for a clean start, but it is more for subsequent runs.
                expect(notes.length).toBeGreaterThanOrEqual(1);

                // Check that the most recent note is the one we just sent before
                const note = notes.pop()!;
                expect(note.note.isSuccessfulTrustedCall);
                const call = worker.createType('IntegriteeTrustedCall', note.note.asSuccessfulTrustedCall);
                expect(call.isBalanceTransferWithNote);
                expect(call.asBalanceTransferWithNote[3].toString()).toEqual(testNote)
                expect(note.timestamp.toNumber() < Date.now());
                const oneMinuteMs = 60 * 1000;
                expect(note.timestamp.toNumber() > Date.now() - oneMinuteMs);
            });
        });

        // race condition so skipped
        describe.only('session proxies (delegates) should work', () => {
            it('add delegate should work', async () => {
                const shard = network.shard;
                const now = new Date();
                const expiryDate = new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000);
                const expiry = Math.floor(expiryDate.getTime());
                const miniSecret = mnemonicToMiniSecret("secret forest ticket smooth wide mass parent reveal embark impose fiscal company");
                const role = worker.createType('SessionProxyRole', 'Any');
                const result = await worker.trustedAddSessionProxy(
                  alice,
                  shard,
                  network.mrenclave,
                  role,
                  '5DwH48esFAmQWjaae7zvzzAbhRgS4enS7tfUPTbGr6ZFnW7R',
                  expiry,
                  miniSecret,
                );
                console.log('add session proxy', JSON.stringify(result));
                expect(result).toBeDefined();
            });

            it('call as delegate should work', async () => {
                const shard = network.shard;
                const result = await worker.trustedBalanceTransfer(
                  alice,
                  shard,
                  network.mrenclave,
                  alice.address,
                  charlie.address,
                  1100000000000,
                  "My test note",
                  { delegate: charlie }
                );
                console.log('delegated balance transfer result', JSON.stringify(result));
                expect(result).toBeDefined();
            });
        });
        // race condition so skipped
        describe.skip('balance transfer should work', () => {
            it('should return value', async () => {
                const shard = network.shard;
                const result = await worker.trustedBalanceTransfer(
                    alice,
                    shard,
                    network.mrenclave,
                    alice.address,
                    charlie.address,
                    1100000000000
                );
                console.log('balance transfer result', JSON.stringify(result));
                expect(result).toBeDefined();
            });

            it('should return value with note', async () => {
                const shard = network.shard;
                const result = await worker.trustedBalanceTransfer(
                    alice,
                    shard,
                    network.mrenclave,
                    alice.address,
                    charlie.address,
                    1100000000000,
                    "My test note"
                );
                console.log('balance transfer result', JSON.stringify(result));
                expect(result).toBeDefined();
            });
        });

        // race condition so skipped
        describe.skip('balance unshield should work', () => {
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
                console.log('balance unshield result', JSON.stringify(result));
                expect(result).toBeDefined();
            });
        });

        // race condition, so skipped
        describe.skip('guess the number should work', () => {
            it('should return value', async () => {
                const shard = network.shard;

                const result = await worker.guessTheNumber(
                    alice,
                    shard,
                    network.mrenclave,
                    1,
                );
                console.log('guess the number result', JSON.stringify(result));
                expect(result).toBeDefined();
            });
        });
    });
});
