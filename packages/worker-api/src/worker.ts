import '@polkadot/types/augment';

import WebSocketAsPromised from 'websocket-as-promised';
import { options as encointerOptions} from '@encointer/node-api';
import { ApiPromise } from '@polkadot/api';
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
    case '':
      return data;
    default:
      return self.createType(responseType, unwrappedData)
  }
}

export class EncointerWorker extends WebSocketAsPromised implements IEncointerWorker {

  private api: ApiPromise | null;

  public apiPromise: Promise<ApiPromise>;

  rsCount: number;

  rqStack: string[];

  constructor(url: string, options: WorkerOptions) {
    const {api, types} = options;
    const opts: any = {
      packMessage: (data: any) => this.createType('ClientRequest', data).toU8a(),
      unpackMessage: (data: any) => parseGetterResponse(this, this.rqStack.shift() || '', data),
      attachRequestId: (data: any, id: number): any => data,
      extractRequestId: (data: any) => ++this.rsCount
    };
    super(url, opts);
    this.rsCount = 0;
    this.rqStack = [] as string[]
    this.api = null;
    this.apiPromise = Promise.reject();
    if (api) {
      this.api = api;
      this.apiPromise = Promise.resolve(api)
    } else if (types) {
      this.apiPromise = ApiPromise.create(encointerOptions({types: options.types}))
      this.apiPromise.then( api => this.api = api)
    }
  }

  public createType(apiType: string, obj: any): any {
    return this.api && this.api.createType(apiType as never, obj);
  }

  public async getTotalIssuance(cid: string, options: CallOptions = {} as  CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'total_issuance', 'Balance'], {cid}, options);
  }

  public async getParticipantCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'participant_count', 'u64'], {cid}, options);
  }

  public async getMeetupCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'meetup_count', 'u64'], {cid}, options);
  }

  public async getCeremonyReward (cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'ceremony_reward', 'I64F64'], {cid}, options);
  }

  public async getLocationTolerance (cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Public, 'location_tolerance', 'u32'], {cid}, options);
  }

  public async getTimeTolerance (cid: string, options: CallOptions = {} as CallOptions): Promise<Moment> {
    return callGetter<Moment>(this, [GetterType.Public, 'time_tolerance', 'Moment'], {cid}, options);
  }

  public async getBalance (account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
    return callGetter<number>(this, [GetterType.Trusted, 'balance', 'Balance'], {cid, account}, options);
  }

  public async getRegistration(account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<ParticipantIndexType> {
    return callGetter<ParticipantIndexType>(this, [GetterType.Trusted, 'registration', 'ParticipantIndexType' ], {cid, account}, options)
  }

  public async getMeetupIndexAndLocation (account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<MeetupAssignment> {
    return callGetter<MeetupAssignment>(this, [GetterType.Trusted, 'meetup_index_and_location', 'MeetupAssignment'], {cid, account}, options)
  }

  public async getAttestations (account: KeyringPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Vec<Attestation>> {
    return callGetter<Vec<Attestation>>(this, [GetterType.Trusted, 'attestations', 'Vec<Attestation>'], {cid, account}, options);
  }
}
