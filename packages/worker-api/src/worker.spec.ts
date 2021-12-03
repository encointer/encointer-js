import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { localDockerNetwork } from './testUtils/networks';
import { EncointerWorker } from './worker';
import WS from 'websocket';
import { CommunityIdentifier } from "@encointer/types";

const {w3cwebsocket: WebSocket} = WS;

describe('worker', () => {
  const network = localDockerNetwork();
  let keyring: Keyring;
  let worker: EncointerWorker;
  beforeAll(async () => {
    jest.setTimeout(90000);
    await cryptoWaitReady();
    keyring = new Keyring({type: 'sr25519'});
    const keypair = keyring.addFromUri('//Bob');
    const json = keypair.toJson('1234');
    keypair.lock();
    keyring.addFromJson(json);

    worker = new EncointerWorker(network.worker, {
      keyring: keyring,
      types: network.customTypes,
      // @ts-ignore
      createWebSocket: (url) => new WebSocket(url)
    });
  });

  describe('trusted call', () => {
    it('ceremonies_register_participant is valid', () => {
      const alice = keyring.addFromUri('//Alice');
      const proof = worker.createType('Option<ProofOfAttendance<MultiSignature, AccountId>>');
      const cid: CommunityIdentifier = worker.cidFromStr('gbsuv7YXq9G');
      const nonce = worker.createType('u32', 0)
      const args = worker.createType('RegisterParticipantArgs', [alice.publicKey, cid, proof])

      console.log(cid.toHex());

      // trustedCall from the previous js-implementation that is known to work.
      const tCallHex = '0x01d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d6762737576ffffffff0000000000940cf3e675d8bd25066ad8a15af580ca9a41d3b13f840f43647f51869875fb62232086204dffc8ee67d959e2e3135eae214dd6296e76706459f6c9c8f2b3be86'

      const call = worker.trustedCallRegisterParticipant(
        alice,
        cid,
        network.mrenclave,
        nonce,
        args
      );

      // the last 64 bytes are from the non-deterministic signature
      expect(call.toHex().slice(0, -128)).toEqual(tCallHex.slice(0, -128));
    })
  })

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

    describe('getTotalIssuance', () => {
      it('should return value', async () => {
        const result = await worker.getTotalIssuance(network.chosenCid);
        // console.log('getTotalIssuance', result);
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
        // console.log('schedulerStateResult', result);
        expect(result).toBeDefined();
      });
    });

    describe('getBalance', () => {
      it('should return value', async () => {
        const result = await worker.getBalance({
          pubKey: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
          pin: '1234'
        }, network.chosenCid);
        // console.log('getBalance', result);
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
