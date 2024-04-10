// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { Attestation, ProofOfAttendance } from '@encointer/types/interfaces/ceremony';
import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Enum, Option, Struct, Vec, u32 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { Signature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name EncointerBalanceTransferArgs */
export interface EncointerBalanceTransferArgs extends ITuple<[AccountId, AccountId, CommunityIdentifier, BalanceType]> {}

/** @name EncointerGetter */
export interface EncointerGetter extends Enum {
  readonly isPublic: boolean;
  readonly asPublic: EncointerPublicGetter;
  readonly isTrusted: boolean;
  readonly asTrusted: EncointerTrustedGetterSigned;
  readonly type: 'Public' | 'Trusted';
}

/** @name EncointerGetterArgs */
export interface EncointerGetterArgs extends ITuple<[AccountId, CommunityIdentifier]> {}

/** @name EncointerPublicGetter */
export interface EncointerPublicGetter extends Enum {
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

/** @name EncointerTrustedCall */
export interface EncointerTrustedCall extends Enum {
  readonly isBalanceTransfer: boolean;
  readonly asBalanceTransfer: EncointerBalanceTransferArgs;
  readonly isCeremoniesRegisterParticipant: boolean;
  readonly asCeremoniesRegisterParticipant: RegisterParticipantArgs;
  readonly isCeremoniesRegisterAttestations: boolean;
  readonly asCeremoniesRegisterAttestations: RegisterAttestationsArgs;
  readonly isCeremoniesGrantReputation: boolean;
  readonly asCeremoniesGrantReputation: GrantReputationArgs;
  readonly type: 'BalanceTransfer' | 'CeremoniesRegisterParticipant' | 'CeremoniesRegisterAttestations' | 'CeremoniesGrantReputation';
}

/** @name EncointerTrustedCallSigned */
export interface EncointerTrustedCallSigned extends Struct {
  readonly call: EncointerTrustedCall;
  readonly nonce: u32;
  readonly signature: Signature;
}

/** @name EncointerTrustedGetter */
export interface EncointerTrustedGetter extends Enum {
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
  readonly type: 'Balance' | 'ParticipantIndex' | 'MeetupIndex' | 'Attestations' | 'MeetupRegistry';
}

/** @name EncointerTrustedGetterSigned */
export interface EncointerTrustedGetterSigned extends Struct {
  readonly getter: EncointerTrustedGetter;
  readonly signature: Signature;
}

/** @name GrantReputationArgs */
export interface GrantReputationArgs extends ITuple<[AccountId, CommunityIdentifier, AccountId]> {}

/** @name RegisterAttestationsArgs */
export interface RegisterAttestationsArgs extends ITuple<[AccountId, Vec<Attestation>]> {}

/** @name RegisterParticipantArgs */
export interface RegisterParticipantArgs extends ITuple<[AccountId, CommunityIdentifier, Option<ProofOfAttendance>]> {}

export type PHANTOM_ENCOINTERWORKER = 'encointerWorker';
