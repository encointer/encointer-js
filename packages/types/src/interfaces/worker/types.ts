// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Enum, Option, Struct, Text, Vec, u32, u64 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { Attestation, ProofOfAttendance } from '@encointer/types/interfaces/ceremony';
import type { BalanceType, CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Signature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, Hash } from '@polkadot/types/interfaces/runtime';

/** @name ClientRequest */
export interface ClientRequest extends Enum {
  readonly isPubKeyWorker: boolean;
  readonly isMuRaPortWorker: boolean;
  readonly isStfState: boolean;
  readonly asStfState: ITuple<[Getter, ShardIdentifier]>;
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
}

/** @name GetterArgs */
export interface GetterArgs extends ITuple<[AccountId, CommunityIdentifier]> {}

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
}

/** @name Request */
export interface Request extends Struct {
  readonly shard: ShardIdentifier;
  readonly cyphertext: WorkerEncoded;
}

/** @name ShardIdentifier */
export interface ShardIdentifier extends Hash {}

/** @name TrustedCall */
export interface TrustedCall extends Enum {
  readonly isBalanceTransfer: boolean;
  readonly asBalanceTransfer: ITuple<[AccountId, AccountId, CommunityIdentifier, BalanceType]>;
  readonly isCeremoniesRegisterParticipant: boolean;
  readonly asCeremoniesRegisterParticipant: ITuple<[AccountId, CommunityIdentifier, Option<ProofOfAttendance>]>;
  readonly isCeremoniesRegisterAttestations: boolean;
  readonly asCeremoniesRegisterAttestations: ITuple<[AccountId, Vec<Attestation>]>;
  readonly isCeremoniesGrantReputation: boolean;
  readonly asCeremoniesGrantReputation: ITuple<[AccountId, CommunityIdentifier, AccountId]>;
}

/** @name TrustedCallSigned */
export interface TrustedCallSigned extends Struct {
  readonly call: TrustedCall;
  readonly nonce: u32;
  readonly signature: Signature;
}

/** @name TrustedGetter */
export interface TrustedGetter extends Enum {
  readonly isBalance: boolean;
  readonly asBalance: ITuple<[AccountId, CommunityIdentifier]>;
  readonly isParticipantIndex: boolean;
  readonly asParticipantIndex: ITuple<[AccountId, CommunityIdentifier]>;
  readonly isMeetupIndex: boolean;
  readonly asMeetupIndex: ITuple<[AccountId, CommunityIdentifier]>;
  readonly isAttestations: boolean;
  readonly asAttestations: ITuple<[AccountId, CommunityIdentifier]>;
  readonly isMeetupRegistry: boolean;
  readonly asMeetupRegistry: ITuple<[AccountId, CommunityIdentifier]>;
}

/** @name TrustedGetterSigned */
export interface TrustedGetterSigned extends Struct {
  readonly getter: TrustedGetter;
  readonly signature: Signature;
}

/** @name WorkerEncoded */
export interface WorkerEncoded extends Bytes {}

export type PHANTOM_WORKER = 'worker';
