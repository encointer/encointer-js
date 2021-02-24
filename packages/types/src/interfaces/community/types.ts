// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Bytes, Enum, Struct, i128 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { CeremonyIndexType } from '@encointer/types/interfaces/ceremony';
import type { BlockNumber, Hash } from '@polkadot/types/interfaces/runtime';

/** @name BalanceEntry */
export interface BalanceEntry extends Struct {
  readonly principal: i128;
  readonly last_update: BlockNumber;
}

/** @name BalanceType */
export interface BalanceType extends i128 {}

/** @name CommunityCeremony */
export interface CommunityCeremony extends ITuple<[CommunityIdentifier, CeremonyIndexType]> {}

/** @name CommunityIdentifier */
export interface CommunityIdentifier extends Hash {}

/** @name CommunityPropertiesType */
export interface CommunityPropertiesType extends Struct {
  readonly name_utf8: Bytes;
  readonly demurrage_per_block: Demurrage;
}

/** @name Demurrage */
export interface Demurrage extends i128 {}

/** @name Reputation */
export interface Reputation extends Enum {
  readonly isUnverified: boolean;
  readonly isUnverifiedReputable: boolean;
  readonly isVerifiedUnlinked: boolean;
  readonly isVerifiedLinked: boolean;
}

export type PHANTOM_COMMUNITY = 'community';
