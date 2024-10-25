import { cryptoWaitReady } from '@polkadot/util-crypto';
import {localDockerNetwork} from './testUtils/networks.js';
import { Worker } from './websocketWorker.js';
import bs58 from "bs58";

describe('worker', () => {
  const network = localDockerNetwork();
  let worker: Worker;
  beforeAll(async () => {
    jest.setTimeout(90000);
    await cryptoWaitReady();
    worker = new Worker(network.worker);
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

    describe('getFingerprint', () => {
      it('should return value', async () => {
        const mrenclave = await worker.getFingerprint();

        console.log('Fingerprint', bs58.encode(mrenclave.toU8a()));
        expect(mrenclave).toBeDefined();
      });
    });
  });
});
