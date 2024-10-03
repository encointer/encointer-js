import WebSocketAsPromised from 'websocket-as-promised';
import {Keyring} from "@polkadot/keyring";
import type {u8} from "@polkadot/types-codec";
import type {TypeRegistry, Vec} from "@polkadot/types";
import type {RegistryTypes, Signer} from "@polkadot/types/types";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import {Worker} from "./worker.js";
import type {IntegriteeGetter, ShardIdentifier} from "@encointer/types";

export interface IWorker extends WebSocketAsPromised {
  rsCount: number;
  rqStack: string[];
  keyring: () => Keyring | undefined;
  createType: (apiType: string, obj?: any) => any;
  open: () => Promise<Event>;
  encrypt: (data: Uint8Array) => Promise<Vec<u8>>
  registry: () => TypeRegistry
}

export interface ISubmittableGetter<W extends Worker, Type> {

  worker: W;

  shard: ShardIdentifier;

  getter: IntegriteeGetter;

  returnType: string,

  into_rpc(): JsonRpcRequest;

  send(): Promise<Type>;
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
  account: AddressOrPair;
  signer?: Signer
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
