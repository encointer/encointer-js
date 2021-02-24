// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Enum, Struct, Text, u64 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
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
