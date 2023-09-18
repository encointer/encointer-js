// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { CeremonyIndexType } from '@encointer/types/interfaces/ceremony';
import type { Enum, Option, Struct, Text, U8aFixed, i128 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name AnnouncementSigner */
export interface AnnouncementSigner extends Enum {
  readonly isBip340: boolean;
  readonly asBip340: Bip340;
  readonly type: 'Bip340';
}

/** @name Bip340 */
export interface Bip340 extends AccountId {}

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
  readonly assets: Text;
  readonly theme: Option<Text>;
  readonly url: Option<Text>;
  readonly announcementSigner: Option<AnnouncementSigner>;
  readonly rules: CommunityRules;
}

/** @name CommunityRules */
export interface CommunityRules extends Enum {
  readonly isLoCo: boolean;
  readonly isLoCoFlex: boolean;
  readonly isBeeDance: boolean;
  readonly type: 'LoCo' | 'LoCoFlex' | 'BeeDance';
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
