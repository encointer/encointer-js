// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { CeremonyIndexType } from '@encointer/types/interfaces/ceremony';
import type { Option, Struct, Text, U8aFixed, i128 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';

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
  readonly theme: Option<Text>;
  readonly url: Option<Text>;
}

/** @name DegreeFixed */
export interface DegreeFixed extends i128 {}

/** @name DegreeRpc */
export interface DegreeRpc extends Text {}

/** @name GeoHash */
export interface GeoHash extends U8aFixed {}

/** @name Location */
export interface Location extends Struct {
  readonly lat: DegreeFixed;
  readonly lon: DegreeFixed;
}

/** @name LocationRpc */
export interface LocationRpc extends Struct {
  readonly lat: DegreeRpc;
  readonly lon: DegreeRpc;
}

/** @name NominalIncomeType */
export interface NominalIncomeType extends BalanceType {}

export type PHANTOM_COMMUNITY = 'community';
