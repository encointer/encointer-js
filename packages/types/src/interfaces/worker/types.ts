// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Enum, Struct, Text, u64 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { CurrencyIdentifier } from '@encointer/types/interfaces/currency';
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
export interface GetterArgs extends ITuple<[AccountId, CurrencyIdentifier]> {}

/** @name PublicGetter */
export interface PublicGetter extends Enum {
  readonly isTotalIssuance: boolean;
  readonly asTotalIssuance: CurrencyIdentifier;
  readonly isParticipantCount: boolean;
  readonly asParticipantCount: CurrencyIdentifier;
  readonly isMeetupCount: boolean;
  readonly asMeetupCount: CurrencyIdentifier;
  readonly isCeremonyReward: boolean;
  readonly asCeremonyReward: CurrencyIdentifier;
  readonly isLocationTolerance: boolean;
  readonly asLocationTolerance: CurrencyIdentifier;
  readonly isTimeTolerance: boolean;
  readonly asTimeTolerance: CurrencyIdentifier;
  readonly isSchedulerState: boolean;
  readonly asSchedulerState: CurrencyIdentifier;
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
  readonly asBalance: ITuple<[AccountId, CurrencyIdentifier]>;
  readonly isRegistration: boolean;
  readonly asRegistration: ITuple<[AccountId, CurrencyIdentifier]>;
  readonly isMeetupIndexAndLocation: boolean;
  readonly asMeetupIndexAndLocation: ITuple<[AccountId, CurrencyIdentifier]>;
  readonly isAttestations: boolean;
  readonly asAttestations: ITuple<[AccountId, CurrencyIdentifier]>;
}

/** @name TrustedGetterSigned */
export interface TrustedGetterSigned extends Struct {
  readonly getter: TrustedGetter;
  readonly signature: Signature;
}

/** @name WorkerEncoded */
export interface WorkerEncoded extends Bytes {}

export type PHANTOM_WORKER = 'worker';
