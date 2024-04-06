// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { Attestation, ProofOfAttendance } from '@encointer/types/interfaces/ceremony';
import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Bytes, Enum, Option, Struct, Text, Vec, bool, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { Signature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, Hash } from '@polkadot/types/interfaces/runtime';

/** @name BalanceTransferArgs */
export interface BalanceTransferArgs extends ITuple<[AccountId, AccountId, CommunityIdentifier, BalanceType]> {}

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

/** @name GrantReputationArgs */
export interface GrantReputationArgs extends ITuple<[AccountId, CommunityIdentifier, AccountId]> {}

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

/** @name RegisterAttestationsArgs */
export interface RegisterAttestationsArgs extends ITuple<[AccountId, Vec<Attestation>]> {}

/** @name RegisterParticipantArgs */
export interface RegisterParticipantArgs extends ITuple<[AccountId, CommunityIdentifier, Option<ProofOfAttendance>]> {}

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

/** @name TrustedCall */
export interface TrustedCall extends Enum {
  readonly isBalanceTransfer: boolean;
  readonly asBalanceTransfer: BalanceTransferArgs;
  readonly isCeremoniesRegisterParticipant: boolean;
  readonly asCeremoniesRegisterParticipant: RegisterParticipantArgs;
  readonly isCeremoniesRegisterAttestations: boolean;
  readonly asCeremoniesRegisterAttestations: RegisterAttestationsArgs;
  readonly isCeremoniesGrantReputation: boolean;
  readonly asCeremoniesGrantReputation: GrantReputationArgs;
  readonly type: 'BalanceTransfer' | 'CeremoniesRegisterParticipant' | 'CeremoniesRegisterAttestations' | 'CeremoniesGrantReputation';
}

/** @name TrustedCallSigned */
export interface TrustedCallSigned extends Struct {
  readonly call: TrustedCall;
  readonly nonce: u32;
  readonly signature: Signature;
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
  readonly signature: Signature;
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
