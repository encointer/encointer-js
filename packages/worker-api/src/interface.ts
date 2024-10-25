import WebSocketAsPromised from 'websocket-as-promised';
import {Keyring} from "@polkadot/keyring";
import type {u8} from "@polkadot/types-codec";
import type {TypeRegistry, u32, Vec} from "@polkadot/types";
import type {RegistryTypes, Signer} from "@polkadot/types/types";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import type {
  GuessTheNumberPublicGetter,
  GuessTheNumberTrustedGetter,
  IntegriteeGetter,
  ShardIdentifier
} from "@encointer/types";

export interface IWorker extends WebSocketAsPromised {
  rsCount: number;
  rqStack: string[];
  keyring: () => Keyring | undefined;
  createType: (apiType: string, obj?: any) => any;
  open: () => Promise<Event>;
  encrypt: (data: Uint8Array) => Promise<Vec<u8>>
  registry: () => TypeRegistry
}

export interface GenericGetter {
  toHex(): string
}

export interface IWorkerBase {
  createType: (apiType: string, obj?: any) => any;
  encrypt: (data: Uint8Array) => Promise<Vec<u8>>
  registry: () => TypeRegistry
}

export interface ISubmittableGetter<W extends IWorkerBase, Type> {

  worker: W;

  shard: ShardIdentifier;

  getter: IntegriteeGetter;

  returnType: string,

  send(): Promise<Type>;
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

export type TrustedGetterParams = string | GuessTheNumberTrustedGetter | null

/**
 * Signer options.
 *
 * In the future, this might include other things.
 */
export interface TrustedSignerOptions {
  // If this is null, we assume that the account is a Pair.
  signer?: Signer;

  // If the nonce is null, it will be fetched.
  nonce?: u32;
}

export interface PublicGetterArgs {
  shard: string;
}

export type PublicGetterParams = GuessTheNumberPublicGetter | null

export interface RequestOptions {
  timeout?: number;
  debug?: boolean;
}
