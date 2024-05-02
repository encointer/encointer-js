import type { KeyringPair } from '@polkadot/keyring/types';
import WebSocketAsPromised from 'websocket-as-promised';
import {Keyring} from "@polkadot/keyring";
import type {u8} from "@polkadot/types-codec";
import type {TypeRegistry, Vec} from "@polkadot/types";
import type {RegistryTypes} from "@polkadot/types/types";
import BN from "bn.js";

export interface IWorker extends WebSocketAsPromised {
  rsCount: number;
  rqStack: string[];
  keyring: () => Keyring | undefined;
  createType: (apiType: string, obj?: any) => any;
  open: () => Promise<Event>;
  encrypt: (data: Uint8Array, inputEndian?: BN.Endianness, outputEndian?: BN.Endianness) => Promise<Vec<u8>>
  registry: () => TypeRegistry
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
  types?: RegistryTypes;
  createWebSocket?: (url: string) => WebSocket;
}

export interface TrustedGetterArgs {
  shard: string;
  account: KeyringPair;
}

export interface PublicGetterArgs {
  cid: string;
}

export type RequestArgs = PublicGetterArgs | TrustedGetterArgs |  { }

export interface CallOptions {
  timeout?: number;
  debug?: boolean;
}

export enum Request {
  TrustedGetter,
  PublicGetter,
  Worker
}

export type WorkerMethod = [ Request, string, string ]
