// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, i128 } from '@polkadot/types-codec';
import type { BlockNumber } from '@polkadot/types/interfaces/runtime';

/** @name BalanceEntry */
export interface BalanceEntry extends Struct {
  readonly principal: BalanceType;
  readonly lastUpdate: BlockNumber;
}

/** @name BalanceType */
export interface BalanceType extends i128 {}

/** @name Demurrage */
export interface Demurrage extends BalanceType {}

export type PHANTOM_BALANCES = 'balances';
