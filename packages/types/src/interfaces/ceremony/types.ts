// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Option, Struct, u32, u64 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { CommunityIdentifier, Location } from '@encointer/types/interfaces/community';
import type { MultiSignature, Signature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, Moment } from '@polkadot/types/interfaces/runtime';

/** @name Attestation */
export interface Attestation extends Struct {
  readonly claim: ClaimOfAttendance;
  readonly signature: MultiSignature;
  readonly public: AccountId;
}

/** @name AttestationIndexType */
export interface AttestationIndexType extends u64 {}

/** @name CeremonyIndexType */
export interface CeremonyIndexType extends u32 {}

/** @name CeremonyPhaseType */
export interface CeremonyPhaseType extends Enum {
  readonly isRegistering: boolean;
  readonly isAssigning: boolean;
  readonly isAttesting: boolean;
}

/** @name ClaimOfAttendance */
export interface ClaimOfAttendance extends Struct {
  readonly claimant_public: AccountId;
  readonly ceremony_index: CeremonyIndexType;
  readonly community_identifier: CommunityIdentifier;
  readonly meetup_index: MeetupIndexType;
  readonly location: Location;
  readonly timestamp: Moment;
  readonly number_of_participants_confirmed: u32;
}

/** @name MeetupAssignment */
export interface MeetupAssignment extends ITuple<[MeetupIndexType, Option<Location>]> {}

/** @name MeetupIndexType */
export interface MeetupIndexType extends u64 {}

/** @name ParticipantIndexType */
export interface ParticipantIndexType extends u64 {}

/** @name ProofOfAttendance */
export interface ProofOfAttendance extends Struct {
  readonly prover_public: AccountId;
  readonly ceremony_index: CeremonyIndexType;
  readonly community_identifier: CommunityIdentifier;
  readonly attendee_public: AccountId;
  readonly attendee_signature: Signature;
}

export type PHANTOM_CEREMONY = 'ceremony';
