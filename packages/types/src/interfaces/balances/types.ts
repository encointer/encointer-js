// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Struct, i128 } from '@polkadot/types';
import type { BlockNumber } from '@polkadot/types/interfaces/runtime';

/** @name BalanceEntry */
export interface BalanceEntry extends Struct {
  readonly principal: BalanceType;
  readonly last_update: BlockNumber;
}

/** @name BalanceType */
export interface BalanceType extends i128 {}

/** @name Demurrage */
export interface Demurrage extends BalanceType {}

export type PHANTOM_BALANCES = 'balances';
