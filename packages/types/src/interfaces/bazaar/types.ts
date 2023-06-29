// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { PalletString } from '@encointer/types/interfaces/common';
import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { Struct, u32 } from '@polkadot/types-codec';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name BusinessData */
export interface BusinessData extends Struct {
  readonly url: PalletString;
  readonly last_oid: u32;
}

/** @name BusinessIdentifier */
export interface BusinessIdentifier extends Struct {
  readonly communityIdentifier: CommunityIdentifier;
  readonly controller: AccountId;
}

/** @name OfferingData */
export interface OfferingData extends Struct {
  readonly url: PalletString;
}

/** @name OfferingIdentifier */
export interface OfferingIdentifier extends u32 {}

export type PHANTOM_BAZAAR = 'bazaar';
