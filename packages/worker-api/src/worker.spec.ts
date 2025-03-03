import { cryptoWaitReady } from '@polkadot/util-crypto';
import {localDockerNetwork} from './testUtils/networks.js';
import { Worker } from './worker.js';
import bs58 from "bs58";

import WS from 'websocket';

const {w3cwebsocket: WebSocket} = WS;

describe('worker', () => {
  const network = localDockerNetwork();
  let worker: Worker;
  beforeAll(async () => {
    jest.setTimeout(90000);
    await cryptoWaitReady();
    worker = new Worker(network.worker,
        {
          // @ts-ignore
          createWebSocket: (url) => new WebSocket(
              url,
              undefined,
              undefined,
              undefined,
              // Allow the worker's self-signed certificate, needed in non-reverse proxy setups
              // where we talk to the worker directly.
              { rejectUnauthorized: false }
          ),
        }
    );
  });

  afterAll(async () => {
    await worker.closeWs()
  });

  // skip it, as this requires a worker (and hence a node) to be running
  // To my knowledge jest does not have an option to run skipped tests specifically, does it?
  // Todo: add proper CI to test this too.
  describe.skip('needs worker and node running', () => {
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

    describe('getShard', () => {
      it('should return value', async () => {
        const shard = await worker.getShard();

        console.log('Shard', bs58.encode(shard.toU8a()));
        expect(shard).toBeDefined();
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
