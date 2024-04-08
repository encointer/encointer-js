// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Bytes, Enum, Struct, Text, bool, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, H160, Hash } from '@polkadot/types/interfaces/runtime';

/** @name BalanceSetBalanceArgs */
export interface BalanceSetBalanceArgs extends ITuple<[AccountId, AccountId, BalanceType, BalanceType]> {}

/** @name BalanceShieldArgs */
export interface BalanceShieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ParentchainId]> {}

/** @name BalanceTransferArgs */
export interface BalanceTransferArgs extends ITuple<[AccountId, AccountId, BalanceType]> {}

/** @name BalanceUnshieldArgs */
export interface BalanceUnshieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ShardIdentifier]> {}

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

/** @name Getter */
export interface Getter extends Enum {
  readonly isPublic: boolean;
  readonly asPublic: PublicGetter;
  readonly isTrusted: boolean;
  readonly asTrusted: TrustedGetterSigned;
  readonly type: 'Public' | 'Trusted';
}

/** @name GetterArgs */
export interface GetterArgs extends ITuple<[AccountId, CommunityIdentifier]> {}

/** @name ParentchainId */
export interface ParentchainId extends Enum {
  readonly isIntegritee: boolean;
  readonly isTargetA: boolean;
  readonly isTargetB: boolean;
  readonly type: 'Integritee' | 'TargetA' | 'TargetB';
}

/** @name PublicGetter */
export interface PublicGetter extends Enum {
  readonly isTotalIssuance: boolean;
  readonly asTotalIssuance: CommunityIdentifier;
  readonly isParticipantCount: boolean;
  readonly asParticipantCount: CommunityIdentifier;
  readonly isMeetupCount: boolean;
  readonly asMeetupCount: CommunityIdentifier;
  readonly isCeremonyReward: boolean;
  readonly asCeremonyReward: CommunityIdentifier;
  readonly isLocationTolerance: boolean;
  readonly asLocationTolerance: CommunityIdentifier;
  readonly isTimeTolerance: boolean;
  readonly asTimeTolerance: CommunityIdentifier;
  readonly isSchedulerState: boolean;
  readonly asSchedulerState: CommunityIdentifier;
  readonly type: 'TotalIssuance' | 'ParticipantCount' | 'MeetupCount' | 'CeremonyReward' | 'LocationTolerance' | 'TimeTolerance' | 'SchedulerState';
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

/** @name TimestampSetArgs */
export interface TimestampSetArgs extends ITuple<[AccountId, H160, BalanceType]> {}

/** @name TrustedCall */
export interface TrustedCall extends Enum {
  readonly isNoop: boolean;
  readonly asNoop: AccountId;
  readonly isBalanceSetBalance: boolean;
  readonly asBalanceSetBalance: BalanceSetBalanceArgs;
  readonly isBalanceTransfer: boolean;
  readonly asBalanceTransfer: BalanceTransferArgs;
  readonly isBalanceUnshield: boolean;
  readonly asBalanceUnshield: BalanceUnshieldArgs;
  readonly isBalanceShield: boolean;
  readonly asBalanceShield: BalanceShieldArgs;
  readonly isTimestampSet: boolean;
  readonly asTimestampSet: TimestampSetArgs;
  readonly type: 'Noop' | 'BalanceSetBalance' | 'BalanceTransfer' | 'BalanceUnshield' | 'BalanceShield' | 'TimestampSet';
}

/** @name TrustedCallSigned */
export interface TrustedCallSigned extends Struct {
  readonly call: TrustedCall;
  readonly nonce: u32;
  readonly signature: MultiSignature;
}

/** @name TrustedGetter */
export interface TrustedGetter extends Enum {
  readonly isFreeBalance: boolean;
  readonly asFreeBalance: AccountId;
  readonly isReservedBalance: boolean;
  readonly asReservedBalance: AccountId;
  readonly isNonce: boolean;
  readonly asNonce: AccountId;
  readonly type: 'FreeBalance' | 'ReservedBalance' | 'Nonce';
}

/** @name TrustedGetterSigned */
export interface TrustedGetterSigned extends Struct {
  readonly getter: TrustedGetter;
  readonly signature: MultiSignature;
}

/** @name TrustedOperation */
export interface TrustedOperation extends Enum {
  readonly isIndirectCall: boolean;
  readonly asIndirectCall: TrustedCallSigned;
  readonly isDirectCall: boolean;
  readonly asDirectCall: TrustedCallSigned;
  readonly isGet: boolean;
  readonly asGet: Getter;
  readonly type: 'IndirectCall' | 'DirectCall' | 'Get';
}

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
