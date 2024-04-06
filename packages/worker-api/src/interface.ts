import type { KeyringPair } from '@polkadot/keyring/types';
import WebSocketAsPromised from 'websocket-as-promised';
import {Keyring} from "@polkadot/keyring";

export interface IEncointerWorker extends WebSocketAsPromised {
  rsCount: number;
  rqStack: string[];
  keyring: () => Keyring | undefined;
  createType: (apiType: string, obj?: any) => any;
  open: () => Promise<Event>;
}

export interface JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id: number | string;
}

export function createJsonRpcRequest(method: string, params: any, id: number | string): JsonRpcRequest {
  return {
    jsonrpc: '2.0',
    method: method,
    params: params,
    id: id
  };
}

export interface WorkerOptions {
  keyring?: Keyring;
  api: any;
  types: any;
  createWebSocket?: (url: string) => WebSocket;
}

export interface TrustedGetterArgsDeprecated {
  cid: string;
  account: KeyringPair;
}

export interface TrustedGetterArgs {
  shard: string;
  account: KeyringPair;
}

export interface PublicGetterArgs {
  cid: string;
}

export type RequestArgs = PublicGetterArgs | TrustedGetterArgs | TrustedGetterArgsDeprecated |  { }

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
