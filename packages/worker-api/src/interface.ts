import type { KeyringPair } from '@polkadot/keyring/types';
import WebSocketAsPromised from 'websocket-as-promised';
import {Keyring} from "@polkadot/keyring";

export interface IEncointerWorker extends WebSocketAsPromised {
  rsCount: number;
  rqStack: string[];
  keyring: () => Keyring | undefined;
  createType: (apiType: string, obj: any) => any;
  open: () => Promise<Event>;
}

export interface WorkerOptions {
  keyring?: Keyring;
  api: any;
  types: any;
  createWebSocket?: (url: string) => WebSocket;
}

export interface PubKeyPinPair {
  pubKey: string,
  pin: string,
}

export function isPubKeyPinPair(pair: KeyringPair | PubKeyPinPair) {
  return (pair as PubKeyPinPair).pin !== undefined;
}

export interface TrustedGetterArgs {
  cid: string;
  account: KeyringPair;
}

export interface PublicGetterArgs {
  cid: string;
}

export type RequestArgs = PublicGetterArgs | TrustedGetterArgs | { }

export interface CallOptions {
  timeout: number;
  debug: boolean;
}

export enum Request {
  TrustedGetter,
  PublicGetter,
  Worker
}

export type WorkerMethod = [ Request, string, string ]
