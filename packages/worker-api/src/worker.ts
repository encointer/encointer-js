import '@polkadot/types/augment';

import WebSocketAsPromised from 'websocket-as-promised';
import { options as encointerOptions} from '@encointer/node-api';
import { TypeRegistry } from '@polkadot/types';
import { RegistryTypes } from '@polkadot/types/types';
import { parseI64F64 } from '@encointer/util';
import { hexToU8a, u8aToHex } from '@polkadot/util';

import type { KeyringPair } from '@polkadot/keyring/types';
import type { Vec } from '@polkadot/types';
import type { Moment } from '@polkadot/types/interfaces/runtime';
import type { Attestation, MeetupAssignment, ParticipantIndexType } from '@encointer/types';

import type { IEncointerWorker, WorkerOptions, CallOptions } from './interface';
import  { GetterType } from './interface';
import { parseBalance } from './parsers';
import { callGetter } from './getterApi';

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

const parseGetterResponse = (self: IEncointerWorker, data: string, responseType: string) => {
  const unwrappedData = unwrapWorkerResponse(self, data);
  switch (responseType) {
    case 'Balance':
      return parseBalance(self, unwrappedData)
    case 'I64F64':
      return parseI64F64((unwrappedData))
    case 'raw':
      return data;
    default:
      return self.createType(responseType, unwrappedData)
  }
}

export class EncointerWorker extends WebSocketAsPromised implements IEncointerWorker {

  #registry: TypeRegistry;

  rsCount: number;

  rqStack: string[];

  constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
    super(url, {
      createWebSocket: (options.createWebSocket || undefined),
      packMessage: (data: any) => this.createType('ClientRequest', data).toU8a().buffer,
      unpackMessage: (data: any) => parseGetterResponse(this, this.rqStack.shift() || '', data),
      attachRequestId: (data: any, requestId: string | number): any => data,
      extractRequestId: (data: any) => this.rsCount = ++this.rsCount
    });
    const {api, types} = options;
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

  public createType(apiType: string, obj: any): any {
    return this.#registry.createType(apiType as never, obj)
  }

  public async getTotalIssuance(cid: string, options: CallOptions = {} as  CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'total_issuance', 'Balance'], {cid}, options)
  }

  public async getParticipantCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'participant_count', 'u64'], {cid}, options)
  }

  public async getMeetupCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'meetup_count', 'u64'], {cid}, options)
  }

  public async getCeremonyReward (cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'ceremony_reward', 'I64F64'], {cid}, options)
  }

  public async getLocationTolerance (cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'location_tolerance', 'u32'], {cid}, options)
  }

  public async getTimeTolerance (cid: string, options: CallOptions = {} as CallOptions): Promise<Moment> {
    return callGetter<Moment>(this, [GetterType.Public, 'time_tolerance', 'Moment'], {cid}, options)
  }

  public async getBalance (account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Trusted, 'balance', 'Balance'], {cid, account}, options)
  }

  public async getRegistration(account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<ParticipantIndexType> {
    return callGetter<ParticipantIndexType>(this, [GetterType.Trusted, 'registration', 'ParticipantIndexType' ], {cid, account}, options)
  }

  public async getMeetupIndexAndLocation (account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<MeetupAssignment> {
    return callGetter<MeetupAssignment>(this, [GetterType.Trusted, 'meetup_index_and_location', 'MeetupAssignment'], {cid, account}, options)
  }

  public async getAttestations (account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Vec<Attestation>> {
    return callGetter<Vec<Attestation>>(this, [GetterType.Trusted, 'attestations', 'Vec<Attestation>'], {cid, account}, options)
  }
}
