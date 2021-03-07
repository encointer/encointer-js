// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { u32 } from '@polkadot/types';
import type { ITuple } from '@polkadot/types/types';
import type { CeremonyIndexType, CeremonyPhaseType } from '@encointer/types/interfaces/ceremony';

/** @name SchedulerState */
export interface SchedulerState extends ITuple<[CeremonyIndexType, CeremonyPhaseType, SystemNumber]> {}

/** @name SystemNumber */
export interface SystemNumber extends u32 {}

export type PHANTOM_SCHEDULER = 'scheduler';
