// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { CommunityIdentifier, Location } from '@encointer/types/interfaces/community';
import type { Enum, Option, Struct, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, Moment } from '@polkadot/types/interfaces/runtime';

/** @name Assignment */
export interface Assignment extends Struct {
  readonly bootstrappers_reputables: AssignmentParams;
  readonly endorsees: AssignmentParams;
  readonly newbies: AssignmentParams;
  readonly locations: AssignmentParams;
}

/** @name AssignmentCount */
export interface AssignmentCount extends Struct {
  readonly bootstrappers: ParticipantIndexType;
  readonly reputables: ParticipantIndexType;
  readonly endorsees: ParticipantIndexType;
  readonly newbies: ParticipantIndexType;
}

/** @name AssignmentParams */
export interface AssignmentParams extends Struct {
  readonly m: u64;
  readonly s1: u64;
  readonly s2: u64;
}

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
  readonly type: 'Registering' | 'Assigning' | 'Attesting';
}

/** @name ClaimOfAttendance */
export interface ClaimOfAttendance extends Struct {
  readonly claimant_public: AccountId;
  readonly ceremony_index: CeremonyIndexType;
  readonly community_identifier: CommunityIdentifier;
  readonly meetup_location_index: MeetupIndexType;
  readonly location: Location;
  readonly timestamp: Moment;
  readonly number_of_participants_confirmed: u32;
  readonly claimant_signature: Option<MultiSignature>;
}

/** @name ClaimOfAttendanceSigningPayload */
export interface ClaimOfAttendanceSigningPayload extends Struct {
  readonly claimant_public: AccountId;
  readonly ceremony_index: CeremonyIndexType;
  readonly community_identifier: CommunityIdentifier;
  readonly meetup_location_index: MeetupIndexType;
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
  readonly attendee_signature: MultiSignature;
}

export type PHANTOM_CEREMONY = 'ceremony';
