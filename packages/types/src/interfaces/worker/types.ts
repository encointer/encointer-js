// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Bytes, Enum, Option, Struct, Text, bool, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId, BlockNumber, H256, Hash, Moment } from '@polkadot/types/interfaces/runtime';

/** @name AssetId */
export interface AssetId extends Enum {
  readonly isUnusedIndex0: boolean;
  readonly isUnusedIndex1: boolean;
  readonly isUnusedIndex2: boolean;
  readonly isUnusedIndex3: boolean;
  readonly isUnusedIndex4: boolean;
  readonly isUnusedIndex5: boolean;
  readonly isUnusedIndex6: boolean;
  readonly isUnusedIndex7: boolean;
  readonly isUnusedIndex8: boolean;
  readonly isUnusedIndex9: boolean;
  readonly isUsdt: boolean;
  readonly isUnusedIndex11: boolean;
  readonly isUnusedIndex12: boolean;
  readonly isUnusedIndex13: boolean;
  readonly isUnusedIndex14: boolean;
  readonly isUnusedIndex15: boolean;
  readonly isUnusedIndex16: boolean;
  readonly isUnusedIndex17: boolean;
  readonly isUnusedIndex18: boolean;
  readonly isUnusedIndex19: boolean;
  readonly isUsdc: boolean;
  readonly isUsedE: boolean;
  readonly isUnusedIndex22: boolean;
  readonly isUnusedIndex23: boolean;
  readonly isUnusedIndex24: boolean;
  readonly isUnusedIndex25: boolean;
  readonly isUnusedIndex26: boolean;
  readonly isUnusedIndex27: boolean;
  readonly isUnusedIndex28: boolean;
  readonly isUnusedIndex29: boolean;
  readonly isEth: boolean;
  readonly isWeth: boolean;
  readonly type: 'UnusedIndex0' | 'UnusedIndex1' | 'UnusedIndex2' | 'UnusedIndex3' | 'UnusedIndex4' | 'UnusedIndex5' | 'UnusedIndex6' | 'UnusedIndex7' | 'UnusedIndex8' | 'UnusedIndex9' | 'Usdt' | 'UnusedIndex11' | 'UnusedIndex12' | 'UnusedIndex13' | 'UnusedIndex14' | 'UnusedIndex15' | 'UnusedIndex16' | 'UnusedIndex17' | 'UnusedIndex18' | 'UnusedIndex19' | 'Usdc' | 'UsedE' | 'UnusedIndex22' | 'UnusedIndex23' | 'UnusedIndex24' | 'UnusedIndex25' | 'UnusedIndex26' | 'UnusedIndex27' | 'UnusedIndex28' | 'UnusedIndex29' | 'Eth' | 'Weth';
}

/** @name DirectRequestStatus */
export interface DirectRequestStatus extends Enum {
  readonly isOk: boolean;
  readonly isTrustedOperationStatus: boolean;
  readonly asTrustedOperationStatus: TrustedOperationStatus;
  readonly isError: boolean;
  readonly type: 'Ok' | 'TrustedOperationStatus' | 'Error';
}

/** @name Enclave */
export interface Enclave extends Struct {
  readonly pubkey: AccountId;
  readonly mrenclave: Hash;
  readonly timestamp: u64;
  readonly url: Text;
}

/** @name EnclaveFingerprint */
export interface EnclaveFingerprint extends H256 {}

/** @name GetterArgs */
export interface GetterArgs extends ITuple<[AccountId, CommunityIdentifier]> {}

/** @name ParentchainId */
export interface ParentchainId extends Enum {
  readonly isIntegritee: boolean;
  readonly isTargetA: boolean;
  readonly isTargetB: boolean;
  readonly type: 'Integritee' | 'TargetA' | 'TargetB';
}

/** @name ParentchainInfo */
export interface ParentchainInfo extends Struct {
  readonly id: ParentchainId;
  readonly genesis_hash: Option<Hash>;
  readonly block_number: Option<BlockNumber>;
  readonly now: Option<Moment>;
  readonly creation_block_number: Option<BlockNumber>;
  readonly creation_timestamp: Option<Moment>;
}

/** @name ParentchainsInfo */
export interface ParentchainsInfo extends Struct {
  readonly integritee: ParentchainInfo;
  readonly target_a: ParentchainInfo;
  readonly target_b: ParentchainInfo;
  readonly shielding_target: ParentchainId;
}

/** @name Request */
export interface Request extends Struct {
  readonly shard: ShardIdentifier;
  readonly cyphertext: WorkerEncoded;
}

/** @name RpcReturnValue */
export interface RpcReturnValue extends Struct {
  readonly value: Bytes;
  readonly do_watch: bool;
  readonly status: DirectRequestStatus;
}

/** @name ShardIdentifier */
export interface ShardIdentifier extends Hash {}

/** @name TrustedOperationStatus */
export interface TrustedOperationStatus extends Enum {
  readonly isSubmitted: boolean;
  readonly isFuture: boolean;
  readonly isReady: boolean;
  readonly isBroadCast: boolean;
  readonly isInSidechainBlock: boolean;
  readonly asInSidechainBlock: Hash;
  readonly isRetracted: boolean;
  readonly isFinalityTimeout: boolean;
  readonly isFinalized: boolean;
  readonly isUsurped: boolean;
  readonly isDropped: boolean;
  readonly isInvalid: boolean;
  readonly type: 'Submitted' | 'Future' | 'Ready' | 'BroadCast' | 'InSidechainBlock' | 'Retracted' | 'FinalityTimeout' | 'Finalized' | 'Usurped' | 'Dropped' | 'Invalid';
}

/** @name Vault */
export interface Vault extends ITuple<[AccountId, ParentchainId]> {}

/** @name WorkerEncoded */
export interface WorkerEncoded extends Bytes {}

export type PHANTOM_WORKER = 'worker';
