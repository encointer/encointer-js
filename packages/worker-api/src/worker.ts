import { TypeRegistry } from '@polkadot/types';
import type { RegistryTypes } from '@polkadot/types/types';
import { Keyring } from '@polkadot/keyring'
import { hexToU8a, u8aToHex } from '@polkadot/util';

import WebSocketAsPromised from 'websocket-as-promised';

import { options as encointerOptions } from '@encointer/node-api/index.js';
import {communityIdentifierFromString, parseI64F64} from '@encointer/util/index.js';

// @ts-ignore
import NodeRSA from 'node-rsa';


import type { KeyringPair } from '@polkadot/keyring/types';
import type { Vec, u32, u64 } from '@polkadot/types';
import type { AccountId, Balance, Moment } from '@polkadot/types/interfaces/runtime';
import type {
  Attestation, BalanceEntry, BalanceTransferArgs, CommunityIdentifier, GrantReputationArgs,
  MeetupIndexType,
  ParticipantIndexType, RegisterAttestationsArgs, RegisterParticipantArgs,
  SchedulerState, TrustedCallSigned
} from '@encointer/types/index.js';

import type { IEncointerWorker, WorkerOptions, CallOptions, PubKeyPinPair } from './interface.js';
import { Request } from './interface.js';
import { parseBalance, parseNodeRSA } from './parsers.js';
import { callGetter } from './getterApi.js';
import { createTrustedCall } from "@encointer/worker-api/trustedCallApi.js";
import { toAccount } from "@encointer/util/common.js";

const unwrapWorkerResponse = (self: IEncointerWorker, data: string) => {
  /// Unwraps the value that is wrapped in all the Options and encoding from the worker.
  /// Defaults to return `[]`, which is fine as `createType(api.registry, <type>, [])`
  /// instantiates the <type> with its default value.
  const dataTyped = self.createType('Option<WorkerEncoded>', hexToU8a('0x'.concat(data)))
    .unwrapOrDefault(); // (Option<Value.enc>.enc+whitespacePad)
  const trimmed = u8aToHex(dataTyped).replace(/(20)+$/, '');
  const unwrappedData = self.createType('Option<WorkerEncoded>', hexToU8a(trimmed))
    .unwrapOrDefault();
  return unwrappedData
}

const parseGetterResponse = (self: IEncointerWorker, responseType: string, data: string) => {
  if (data === 'Could not decode request') {
    throw new Error(`Worker error: ${data}`);
  }
  let parsedData: any;
  try {
    switch (responseType) {
      case 'raw':
        parsedData = unwrapWorkerResponse(self, data);
        break;
      case 'BalanceEntry':
        parsedData = unwrapWorkerResponse(self, data);
        parsedData = parseBalance(self, parsedData);
        break;
      case 'I64F64':
        parsedData = unwrapWorkerResponse(self, data);
        parsedData = parseI64F64(self.createType('i128', parsedData));
        break;
      case 'NodeRSA':
        parsedData = parseNodeRSA(data);
        break
      default:
        parsedData = unwrapWorkerResponse(self, data);
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

  rsCount: number;

  rqStack: string[];

  constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
    super(url, {
      createWebSocket: (options.createWebSocket || undefined),
      packMessage: (data: any) => this.createType('ClientRequest', data).toU8a(),
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

  public createType(apiType: string, obj?: any): any {
    return this.#registry.createType(apiType as never, obj)
  }

  public keyring(): Keyring | undefined {
    return this.#keyring;
  }

  public setKeyring(keyring: Keyring): void {
    this.#keyring = keyring;
  }

  public cidFromStr(cidStr: String): CommunityIdentifier {
    return communityIdentifierFromString(this.#registry, cidStr);
  }

  public async getShieldingKey(options: CallOptions = {} as CallOptions): Promise<NodeRSA> {
    return await callGetter<NodeRSA>(this, [Request.Worker, 'PubKeyWorker', 'NodeRSA'], {}, options)
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

  public async getBalance(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<BalanceEntry> {
    return await callGetter<BalanceEntry>(this, [Request.TrustedGetter, 'balance', 'BalanceEntry'], {
      cid,
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

  public trustedCallBalanceTransfer(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: CommunityIdentifier, mrenclave: string, nonce: u32, params: BalanceTransferArgs): TrustedCallSigned {
    return createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], accountOrPubKey, cid, mrenclave, nonce, params)
  }

  public trustedCallRegisterParticipant(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: CommunityIdentifier, mrenclave: string, nonce: u32, params: RegisterParticipantArgs): TrustedCallSigned {
    return createTrustedCall(this, ['ceremonies_register_participant', 'RegisterParticipantArgs'], accountOrPubKey, cid, mrenclave, nonce, params)
  }

  public trustedCallRegisterAttestations(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: CommunityIdentifier, mrenclave: string, nonce: u32, params: RegisterAttestationsArgs): TrustedCallSigned {
    return createTrustedCall(this, ['ceremonies_register_attestations', 'RegisterAttestationsArgs'], accountOrPubKey, cid, mrenclave, nonce, params)
  }

  public trustedCallGrantReputation(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: CommunityIdentifier, mrenclave: string, nonce: u32, params: GrantReputationArgs): TrustedCallSigned {
    return createTrustedCall(this, ['ceremonies_grant_reputation', 'GrantReputationArgs'], accountOrPubKey, cid, mrenclave, nonce, params)
  }
}
