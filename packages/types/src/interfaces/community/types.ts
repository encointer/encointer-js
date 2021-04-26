// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Option, Struct, Text, i128, u32 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { CeremonyIndexType } from '@encointer/types/interfaces/ceremony';
import type { Hash } from '@polkadot/types/interfaces/runtime';

/** @name CommunityCeremony */
export interface CommunityCeremony extends ITuple<[CommunityIdentifier, CeremonyIndexType]> {}

/** @name CommunityIdentifier */
export interface CommunityIdentifier extends Hash {}

/** @name CommunityMetadata */
export interface CommunityMetadata extends Struct {
  readonly name: Text;
  readonly symbol: Text;
  readonly icons: Text;
  readonly theme: Option<Theme>;
  readonly url: Option<Text>;
}

/** @name Degree */
export interface Degree extends i128 {}

/** @name Location */
export interface Location extends Struct {
  readonly lat: Degree;
  readonly lon: Degree;
}

/** @name NominalIncome */
export interface NominalIncome extends BalanceType {}

/** @name Reputation */
export interface Reputation extends Enum {
  readonly isUnverified: boolean;
  readonly isUnverifiedReputable: boolean;
  readonly isVerifiedUnlinked: boolean;
  readonly isVerifiedLinked: boolean;
}

/** @name Theme */
export interface Theme extends Struct {
  readonly primary_swatch: u32;
}

export type PHANTOM_COMMUNITY = 'community';
