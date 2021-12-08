// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
  import type { CeremonyIndexType } from '@encointer/types/interfaces/ceremony';
  import type { Enum, Option, Struct, Text, U8aFixed, i128, u32 } from '@polkadot/types';
  import type { ITuple } from '@polkadot/types/types';

/** @name CidDigest */
export interface CidDigest extends U8aFixed {}

/** @name CidName */
export interface CidName extends Struct {
  readonly cid: CommunityIdentifier;
  readonly name: Text;
}

/** @name CommunityCeremony */
export interface CommunityCeremony extends ITuple<[CommunityIdentifier, CeremonyIndexType]> {}

/** @name CommunityIdentifier */
export interface CommunityIdentifier extends Struct {
  readonly geohash: GeoHash;
  readonly digest: CidDigest;
}

/** @name CommunityMetadataType */
export interface CommunityMetadataType extends Struct {
  readonly name: Text;
  readonly symbol: Text;
  readonly icons: Text;
  readonly theme: Option<Theme>;
  readonly url: Option<Text>;
}

/** @name Degree */
export interface Degree extends i128 {}

/** @name GeoHash */
export interface GeoHash extends U8aFixed {}

/** @name Location */
export interface Location extends Struct {
  readonly lat: Degree;
  readonly lon: Degree;
}

/** @name NominalIncomeType */
export interface NominalIncomeType extends BalanceType {}

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
