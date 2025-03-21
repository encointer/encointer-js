// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Bytes, Enum, Option, Struct, Text, Vec, bool, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId, BlockNumber, H256, Hash, Moment } from '@polkadot/types/interfaces/runtime';

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

/** @name ShardConfig */
export interface ShardConfig extends Struct {
  readonly enclave_fingerprint: EnclaveFingerprint;
  readonly max_instances: Option<u32>;
  readonly authorities: Option<Vec<AccountId>>;
  readonly maintenance_mode: bool;
}

/** @name ShardIdentifier */
export interface ShardIdentifier extends Hash {}

/** @name ShardInfo */
export interface ShardInfo extends Struct {
  readonly config: Option<UpgradableShardConfig>;
  readonly config_updated_at: Option<BlockNumber>;
  readonly status: Option<ShardStatus>;
  readonly mode: ShardMode;
}

/** @name ShardMode */
export interface ShardMode extends Enum {
  readonly isInitializing: boolean;
  readonly isNormal: boolean;
  readonly isMaintenanceOngoing: boolean;
  readonly isRetired: boolean;
  readonly type: 'Initializing' | 'Normal' | 'MaintenanceOngoing' | 'Retired';
}

/** @name ShardSignerStatus */
export interface ShardSignerStatus extends Struct {
  readonly signer: AccountId;
  readonly fingerprint: EnclaveFingerprint;
  readonly last_activity: BlockNumber;
}

/** @name ShardStatus */
export interface ShardStatus extends Vec<ShardSignerStatus> {}

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

/** @name UpgradableShardConfig */
export interface UpgradableShardConfig extends Struct {
  readonly active_config: ShardConfig;
  readonly pending_upgrade: Option<ShardConfig>;
  readonly upgrade_at: Option<BlockNumber>;
}

/** @name Vault */
export interface Vault extends ITuple<[AccountId, ParentchainId]> {}

/** @name WorkerEncoded */
export interface WorkerEncoded extends Bytes {}

export type PHANTOM_WORKER = 'worker';
