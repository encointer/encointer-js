import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {localDockerNetwork} from './testUtils/networks.js';
import { Worker } from './worker.js';
import WS from 'websocket';

const {w3cwebsocket: WebSocket} = WS;

describe.skip('worker', () => {
  const network = localDockerNetwork();
  let keyring: Keyring;
  let worker: Worker;
  beforeAll(async () => {
    jest.setTimeout(90000);
    await cryptoWaitReady();
    keyring = new Keyring({type: 'sr25519'});

    worker = new Worker(network.worker, {
      keyring: keyring,
      types: network.customTypes,
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

    describe('getFingerprint', () => {
      it('should return value', async () => {
        const result = await worker.getFingerprint();
        console.log('Fingerprint', result.toString());
        expect(result).toBeDefined();
      });
    });
  });
});
