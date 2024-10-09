// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { ParentchainId, ShardIdentifier } from '@encointer/types/interfaces/worker';
import type { Enum, Struct, u32 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, Balance, H160 } from '@polkadot/types/interfaces/runtime';

/** @name BalanceSetBalanceArgs */
export interface BalanceSetBalanceArgs extends ITuple<[AccountId, AccountId, BalanceType, BalanceType]> {}

/** @name BalanceShieldArgs */
export interface BalanceShieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ParentchainId]> {}

/** @name BalanceTransferArgs */
export interface BalanceTransferArgs extends ITuple<[AccountId, AccountId, BalanceType]> {}

/** @name BalanceUnshieldArgs */
export interface BalanceUnshieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ShardIdentifier]> {}

/** @name GuessTheNumberArgs */
export interface GuessTheNumberArgs extends ITuple<[AccountId, GuessType]> {}

/** @name GuessTheNumberSetWinningsArgs */
export interface GuessTheNumberSetWinningsArgs extends ITuple<[AccountId, Balance]> {}

/** @name GuessType */
export interface GuessType extends u32 {}

/** @name IntegriteeGetter */
export interface IntegriteeGetter extends Enum {
  readonly isPublic: boolean;
  readonly asPublic: IntegriteePublicGetter;
  readonly isTrusted: boolean;
  readonly asTrusted: IntegriteeTrustedGetterSigned;
  readonly type: 'Public' | 'Trusted';
}

/** @name IntegriteePublicGetter */
export interface IntegriteePublicGetter extends Enum {
  readonly isGuessTheNumberLastLuckyNumber: boolean;
  readonly isGuessTheNumberLastWinningDistance: boolean;
  readonly isGuessTheNumberInfo: boolean;
  readonly type: 'GuessTheNumberLastLuckyNumber' | 'GuessTheNumberLastWinningDistance' | 'GuessTheNumberInfo';
}

/** @name IntegriteeTrustedCall */
export interface IntegriteeTrustedCall extends Enum {
  readonly isNoop: boolean;
  readonly asNoop: AccountId;
  readonly isTimestampSet: boolean;
  readonly asTimestampSet: TimestampSetArgs;
  readonly isBalanceTransfer: boolean;
  readonly asBalanceTransfer: BalanceTransferArgs;
  readonly isBalanceUnshield: boolean;
  readonly asBalanceUnshield: BalanceUnshieldArgs;
  readonly isBalanceShield: boolean;
  readonly asBalanceShield: BalanceShieldArgs;
  readonly isGuessTheNumberSetWinnings: boolean;
  readonly asGuessTheNumberSetWinnings: GuessTheNumberSetWinningsArgs;
  readonly isGuessTheNumberPushByOneDay: boolean;
  readonly asGuessTheNumberPushByOneDay: AccountId;
  readonly isGuessTheNumber: boolean;
  readonly asGuessTheNumber: GuessTheNumberArgs;
  readonly isBalanceSetBalance: boolean;
  readonly asBalanceSetBalance: BalanceSetBalanceArgs;
  readonly type: 'Noop' | 'TimestampSet' | 'BalanceTransfer' | 'BalanceUnshield' | 'BalanceShield' | 'GuessTheNumberSetWinnings' | 'GuessTheNumberPushByOneDay' | 'GuessTheNumber' | 'BalanceSetBalance';
}

/** @name IntegriteeTrustedCallSigned */
export interface IntegriteeTrustedCallSigned extends Struct {
  readonly call: IntegriteeTrustedCall;
  readonly nonce: u32;
  readonly signature: MultiSignature;
}

/** @name IntegriteeTrustedGetter */
export interface IntegriteeTrustedGetter extends Enum {
  readonly isAccountInfo: boolean;
  readonly asAccountInfo: AccountId;
  readonly type: 'AccountInfo';
}

/** @name IntegriteeTrustedGetterSigned */
export interface IntegriteeTrustedGetterSigned extends Struct {
  readonly getter: IntegriteeTrustedGetter;
  readonly signature: MultiSignature;
}

/** @name IntegriteeTrustedOperation */
export interface IntegriteeTrustedOperation extends Enum {
  readonly isIndirectCall: boolean;
  readonly asIndirectCall: IntegriteeTrustedCallSigned;
  readonly isDirectCall: boolean;
  readonly asDirectCall: IntegriteeTrustedCallSigned;
  readonly isGet: boolean;
  readonly asGet: IntegriteeGetter;
  readonly type: 'IndirectCall' | 'DirectCall' | 'Get';
}

/** @name TimestampSetArgs */
export interface TimestampSetArgs extends ITuple<[AccountId, H160, BalanceType]> {}

export type PHANTOM_INTEGRITEEWORKER = 'integriteeWorker';
