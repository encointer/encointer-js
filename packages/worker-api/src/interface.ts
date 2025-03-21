import {Keyring} from "@polkadot/keyring";
import type {Option, u8} from "@polkadot/types-codec";
import type {TypeRegistry, u32, Vec} from "@polkadot/types";
import type {RegistryTypes, Signer} from "@polkadot/types/types";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import type {
  AssetBalanceArgs, EnclaveFingerprint,
  GuessTheNumberPublicGetter,
  GuessTheNumberTrustedGetter, IntegriteeAssetId,
  IntegriteeGetter,
  ShardIdentifier, TrustedOperationStatus
} from "@encointer/types";
import type {H256, Hash} from "@polkadot/types/interfaces/runtime";

export interface IWorkerBase {
  createType: (apiType: string, obj?: any) => any;
  encrypt: (data: Uint8Array) => Promise<Vec<u8>>
  registry: () => TypeRegistry
}

export interface GenericGetter {
  toU8a(): Uint8Array,
  toHex(): string
}

export interface GenericTop {
  toU8a(): Uint8Array,
  toHex(): string
}

export interface TrustedCallResult {
  topHash?: Hash,
  status?: TrustedOperationStatus,
}

// All the assets we support and string variations of it.
export type AssetIdStr = "USDT" | "usdt" | "USDT.e" | "usdt.e" | "USDC" | "usdc" | "USDC.e" | "usdc.e" | "ETH" | "eth" | "WETH" | "weth" | "BTC" | "btc" | "WBTC.e" | "wbtc.e"

// If it is a string, we assume that it is base58 encoded.
export type ShardIdentifierArg = string | ShardIdentifier | EnclaveFingerprint | H256 | Hash;

// If it is a string, we assume that it is base58 encoded.
export type MrenclaveArg = string | ShardIdentifier | EnclaveFingerprint | H256 | Hash;

export interface ISubmittableGetter<W extends IWorkerBase, Type> {

  worker: W;

  shard: ShardIdentifier;

  getter: IntegriteeGetter;

  returnType: string,

  send(): Promise<Type>;
}

export interface WorkerOptions {
  autoConnectMs?: number,
  timeout?: number,
  createWebSocket?: (url: string) => WebSocket;
  keyring?: Keyring;
  types?: RegistryTypes;
}

export interface TrustedGetterArgs {
  shard: ShardIdentifier;
  account: AddressOrPair;
  delegate?: AddressOrPair;
  signer?: Signer
}

export type TrustedGetterParams = string | GuessTheNumberTrustedGetter | null

/**
 * Signer options.
 *
 * In the future, this might include other things.
 */
export interface TrustedSignerOptions {
  // use signer extension? If this is null, we assume that the account is a Pair.
  signer?: Signer;

  // use session proxy pair?
  delegate?: AddressOrPair

  // If the nonce is null, it will be fetched.
  nonce?: u32;
}

export interface PublicGetterArgs {
  shard: ShardIdentifier;
}

export type PublicGetterParams = GuessTheNumberPublicGetter | null | Option<IntegriteeAssetId> | IntegriteeAssetId | AssetBalanceArgs
