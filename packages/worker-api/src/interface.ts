import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';

interface RequestOptions {
    requestId?: number;
    timeout?: number;
}

export interface IEncointerWorker {
  rsCount: number,
  rqStack: string[],
  createType: (apiType: string, obj: any) => any,
  apiPromise: Promise<ApiPromise>,
  sendRequest: (data: any, options?: RequestOptions) => Promise<any>;
}

export interface WorkerOptions {
  api: any,
  types: any
}

export interface TrustedGetterArgs {
  cid: string,
  account: KeyringPair,
}

export interface PublicGetterArgs {
  cid: string,
}

export type GetterArgs = PublicGetterArgs | TrustedGetterArgs

export interface CallOptions {
  timeout: number,
}

export enum GetterType {
  Trusted,
  Public,
}

export type WorkerMethod = [ GetterType, string, string ]
