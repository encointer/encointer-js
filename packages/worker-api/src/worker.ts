import type {u32, u64, Vec} from '@polkadot/types';
import {TypeRegistry} from '@polkadot/types';
import type {RegistryTypes} from '@polkadot/types/types';
import {Keyring} from '@polkadot/keyring'
import {bufferToU8a, compactAddLength, hexToU8a, u8aToBuffer} from '@polkadot/util';

import WebSocketAsPromised from 'websocket-as-promised';

import {options as encointerOptions} from '@encointer/node-api';
import {communityIdentifierFromString, parseI64F64} from '@encointer/util';

// @ts-ignore
import NodeRSA from 'node-rsa';


import type {KeyringPair} from '@polkadot/keyring/types';
import type {AccountId, Balance, Hash, Moment} from '@polkadot/types/interfaces/runtime';
import type {
  Attestation,
  BalanceTransferArgs,
  CommunityIdentifier,
  MeetupIndexType,
  ParticipantIndexType,
  SchedulerState, ShardIdentifier, TrustedCallSigned,
  Vault
} from '@encointer/types';

import {type CallOptions, type IEncointerWorker, Request, type WorkerOptions} from './interface.js';
import {parseBalance, parseNodeRSA} from './parsers.js';
import {callGetter, sendTrustedCall} from './sendRequest.js';
import {createTrustedCall} from "@encointer/worker-api/requests.js";
import {PubKeyPinPair, toAccount} from "@encointer/util/common";
import type {u8} from "@polkadot/types-codec";

const unwrapWorkerResponse = (self: IEncointerWorker, data: string) => {
  /// Defaults to return `[]`, which is fine as `createType(api.registry, <type>, [])`
  /// instantiates the <type> with its default value.
  const dataTyped = self.createType('Option<WorkerEncoded>', data)
  return dataTyped.unwrapOrDefault();
}

const parseGetterResponse = (self: IEncointerWorker, responseType: string, data: string) => {
  if (data === 'Could not decode request') {
    throw new Error(`Worker error: ${data}`);
  }

  console.log(`Getter response: ${data}`);
  const json = JSON.parse(data);

  const value = hexToU8a(json["result"]);
  const returnValue = self.createType('RpcReturnValue', value);
  console.log(`RpcReturnValue ${JSON.stringify(returnValue)}`);

  if (returnValue.status.isError) {
    const errorMsg = self.createType('String', returnValue.value);
    throw new Error(`RPC Error: ${errorMsg}`);
  }

  let parsedData: any;
  try {
    switch (responseType) {
      case 'raw':
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        break;
      case 'BalanceEntry':
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        parsedData = parseBalance(self, parsedData);
        break;
      case 'I64F64':
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        parsedData = parseI64F64(self.createType('i128', parsedData));
        break;
      case 'NodeRSA':
        const jsonStr = self.createType('String', returnValue.value);
        // Todo: For some reason there are 2 non-utf characters, where I don't know where
        // they come from currently.
        console.log(`Got shielding key: ${jsonStr.toJSON().substring(2)}`);
        parsedData = parseNodeRSA(jsonStr.toJSON().substring(2));
        break
      case 'Vault':
        parsedData = self.createType(responseType, returnValue.value);
        break
      case 'TrustedOperationResult':
        parsedData = self.createType('Hash', returnValue.value);
        break
      default:
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        console.log(`unwrapped data ${parsedData}`);
        parsedData = self.createType(responseType, parsedData);
        break;
    }
  } catch (err) {
    throw new Error(`Can't parse into ${responseType}:\n${err}`);
  }
  return parsedData;
}

export class EncointerWorker extends WebSocketAsPromised implements IEncointerWorker {

  readonly #registry: TypeRegistry;

  #keyring?: Keyring;

  #shieldingKey?: NodeRSA

  rsCount: number;

  rqStack: string[];

  constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
    super(url, {
      createWebSocket: (options.createWebSocket || undefined),
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => parseGetterResponse(this, this.rqStack.shift() || '', data),
      attachRequestId: (data: any): any => data,
      extractRequestId: () => this.rsCount = ++this.rsCount
    });
    const {api, types} = options;
    this.#keyring = (options.keyring || undefined);
    this.#registry = new TypeRegistry();
    this.rsCount = 0;
    this.rqStack = [] as string[]
    if (api) {
      this.#registry = api.registry;
    } else if (types) {
      this.#registry.register(encointerOptions({types: options.types}).types as RegistryTypes);
    } else {
      this.#registry.register(encointerOptions().types as RegistryTypes);
    }
  }

  public encrypt(data: Uint8Array): Vec<u8> {
    const buffer = u8aToBuffer(data);
    const cypherTextBuffer = this.shieldingKey().encrypt(buffer);
    const cypherArray = bufferToU8a(cypherTextBuffer);
    return this.createType('Vec<u8>', compactAddLength(cypherArray))
  }

  public createType(apiType: string, obj?: any): any {
    return this.#registry.createType(apiType as never, obj)
  }

  public keyring(): Keyring | undefined {
    return this.#keyring;
  }

  public setKeyring(keyring: Keyring): void {
    this.#keyring = keyring;
  }

  public shieldingKey(): NodeRSA | undefined {
    return this.#shieldingKey;
  }

  public setShieldingKey(shieldingKey: NodeRSA): void {
    this.#shieldingKey = shieldingKey;
  }

  public cidFromStr(cidStr: String): CommunityIdentifier {
    return communityIdentifierFromString(this.#registry, cidStr);
  }

  public async getShieldingKey(options: CallOptions = {} as CallOptions): Promise<NodeRSA> {
    return await callGetter<NodeRSA>(this, [Request.Worker, 'author_getShieldingKey', 'NodeRSA'], {}, options)
  }

  public async getShardVault(options: CallOptions = {} as CallOptions): Promise<Vault> {
    return await callGetter<Vault>(this, [Request.Worker, 'author_getShardVault', 'Vault'], {}, options)
  }

  public async getNonce(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<u32> {
    return await callGetter<u32>(this, [Request.TrustedGetter, 'nonce', 'u32'], {
      shard: cid,
      account: toAccount(accountOrPubKey, this.#keyring)
    }, options)
  }

  public async getTotalIssuance(cid: string, options: CallOptions = {} as CallOptions): Promise<Balance> {
    return await callGetter<Balance>(this, [Request.PublicGetter, 'total_issuance', 'Balance'], {cid}, options)
  }

  public async getParticipantCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return (await callGetter<u64>(this, [Request.PublicGetter, 'participant_count', 'u64'], {cid}, options)).toNumber()
  }

  public async getMeetupCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return (await callGetter<u64>(this, [Request.PublicGetter, 'meetup_count', 'u64'], {cid}, options)).toNumber()
  }

  public async getCeremonyReward(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return await callGetter<number>(this, [Request.PublicGetter, 'ceremony_reward', 'I64F64'], {cid}, options)
  }

  public async getLocationTolerance(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return (await callGetter<u32>(this, [Request.PublicGetter, 'location_tolerance', 'u32'], {cid}, options)).toNumber()
  }

  public async getTimeTolerance(cid: string, options: CallOptions = {} as CallOptions): Promise<Moment> {
    return await callGetter<Moment>(this, [Request.PublicGetter, 'time_tolerance', 'Moment'], {cid}, options)
  }

  public async getSchedulerState(cid: string, options: CallOptions = {} as CallOptions): Promise<SchedulerState> {
    return await callGetter<SchedulerState>(this, [Request.PublicGetter, 'scheduler_state', 'SchedulerState'], {cid}, options)
  }

  public async getBalance(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Balance> {
    return await callGetter<Balance>(this, [Request.TrustedGetter, 'free_balance', 'Balance'], {
      shard: cid,
      account: toAccount(accountOrPubKey, this.#keyring)
    }, options)
  }

  public async getParticipantIndex(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<ParticipantIndexType> {
    return await callGetter<ParticipantIndexType>(this, [Request.TrustedGetter, 'participant_index', 'ParticipantIndexType'], {
      cid,
      account: toAccount(accountOrPubKey, this.#keyring)
    }, options)
  }

  public async getMeetupIndex(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<MeetupIndexType> {
    return await callGetter<MeetupIndexType>(this, [Request.TrustedGetter, 'meetup_index', 'MeetupIndexType'], {
      cid,
      account: toAccount(accountOrPubKey, this.#keyring)
    }, options)
  }

  public async getAttestations(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Vec<Attestation>> {
    return await callGetter<Vec<Attestation>>(this, [Request.TrustedGetter, 'attestations', 'Vec<Attestation>'], {
      cid,
      account: toAccount(accountOrPubKey, this.#keyring)
    }, options)
  }

  public async getMeetupRegistry(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Vec<AccountId>> {
    return await callGetter<Vec<AccountId>>(this, [Request.TrustedGetter, 'meetup_registry', 'Vec<AccountId>'], {
      cid,
      account: toAccount(accountOrPubKey, this.#keyring)
    }, options)
  }

  public async trustedBalanceTransfer(accountOrPubKey: KeyringPair | PubKeyPinPair, shard: ShardIdentifier, mrenclave: string, params: BalanceTransferArgs, options: CallOptions = {} as CallOptions): Promise<Hash> {
        const nonce = await this.getNonce(accountOrPubKey, mrenclave, options);
        const call = createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], accountOrPubKey, shard, mrenclave, nonce, params);
        return this.sendTrustedCall(call, shard, options);
  }

  async sendTrustedCall(call: TrustedCallSigned, shard: ShardIdentifier, options: CallOptions = {} as CallOptions):  Promise<Hash> {
    if (this.shieldingKey() == undefined) {
      const key = await this.getShieldingKey(options);
      console.log(`Setting the shielding pubKey of the worker.`)
      this.setShieldingKey(key);
    }

    return sendTrustedCall<Hash>(this, call, shard, true, 'TrustedOperationResult', options);
  }
}
