import type { KeyringPair } from '@polkadot/keyring/types';
import WebSocketAsPromised from 'websocket-as-promised';

export interface IEncointerWorker extends WebSocketAsPromised {
  rsCount: number;
  rqStack: string[];
  createType: (apiType: string, obj: any) => any;
  open: () => Promise<Event>;
}

export interface WorkerOptions {
  api: any;
  types: any;
  createWebSocket?: (url: string) => WebSocket;
}

export interface TrustedGetterArgs {
  cid: string;
  account: KeyringPair;
}

export interface PublicGetterArgs {
  cid: string;
}

export type GetterArgs = PublicGetterArgs | TrustedGetterArgs | { }

export interface CallOptions {
  timeout: number;
  debug: boolean;
}

export enum GetterType {
  Trusted,
  Public,
  Request
}

export type WorkerMethod = [ GetterType, string, string ]
