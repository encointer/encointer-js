// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { ParentchainId, ShardIdentifier } from '@encointer/types/interfaces/worker';
import type { Bytes, Enum, Option, Struct, Text, Vec, u16, u32, u64 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import type {AccountId, Balance, H160, Moment} from '@polkadot/types/interfaces/runtime';
import type {AccountInfo} from "@polkadot/types/interfaces/system";

/** @name AttemptsArg */
export interface AttemptsArg extends Struct {
  readonly origin: AccountId;
}

/** @name BalanceShieldArgs */
export interface BalanceShieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ParentchainId]> {}

/** @name BalanceTransferArgs */
export interface BalanceTransferArgs extends ITuple<[AccountId, AccountId, BalanceType]> {}

/** @name BalanceTransferWithNoteArgs */
export interface BalanceTransferWithNoteArgs extends ITuple<[AccountId, AccountId, BalanceType, Text]> {}

/** @name SendNoteArgs */
export interface SendNoteArgs extends ITuple<[AccountId, AccountId, Text]> {}

/** @name AddSessionProxyArgs */
export interface AddSessionProxyArgs extends ITuple<[AccountId, AccountId, SessionProxyCredentials]> {}

/** @name SessionProxyRole */
export interface SessionProxyRole extends Enum {
  readonly isReadBalance: boolean;
  readonly isReadAny: boolean;
  readonly isNonTransfer: boolean;
  readonly isAny: boolean;
  readonly isTransferAllowance: boolean;
  readonly asTransferAllowance: Balance;
  readonly type: 'ReadBalance' | 'ReadAny' | 'NonTransfer' | 'Any' | 'TransferAllowance';
}

/** @name SessionProxyCredentials */
export interface SessionProxyCredentials extends Struct {
  readonly role: SessionProxyRole;
  readonly expiry: Option<Moment>;
  readonly seed: Uint8Array;
}

/** @name AccountInfoAndSessionProxies */
export interface AccountInfoAndSessionProxies extends Struct {
  readonly account_info: AccountInfo;
  readonly session_proxies: Vec<SessionProxyCredentials>;
}

/** @name BalanceUnshieldArgs */
export interface BalanceUnshieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ShardIdentifier]> {}

/** @name BucketIndex */
export interface BucketIndex extends u32 {}

/** @name BucketInfo */
export interface BucketInfo extends Struct {
  readonly index: BucketIndex;
  readonly bytes: u32;
  readonly begins_at: Moment;
  readonly ends_at: Moment;
}

/** @name GuessArgs */
export interface GuessArgs extends ITuple<[AccountId, GuessType]> {}

/** @name GuessTheNumberInfo */
export interface GuessTheNumberInfo extends Struct {
  readonly account: AccountId;
  readonly balance: Balance;
  readonly winnings: Balance;
  readonly next_round_timestamp: Moment;
  readonly last_winners: Vec<AccountId>;
  readonly maybe_last_lucky_number: Option<GuessType>;
  readonly maybe_last_winning_distance: Option<GuessType>;
}

/** @name GuessTheNumberPublicGetter */
export interface GuessTheNumberPublicGetter extends Enum {
  readonly isGuessTheNumberInfo: boolean;
  readonly type: 'GuessTheNumberInfo';
}

/** @name GuessTheNumberSetWinningsArgs */
export interface GuessTheNumberSetWinningsArgs extends ITuple<[AccountId, Balance]> {}

/** @name GuessTheNumberTrustedCall */
export interface GuessTheNumberTrustedCall extends Enum {
  readonly isSetWinnings: boolean;
  readonly asSetWinnings: GuessTheNumberSetWinningsArgs;
  readonly isPushByOneDay: boolean;
  readonly asPushByOneDay: AccountId;
  readonly isGuess: boolean;
  readonly asGuess: GuessArgs;
  readonly type: 'SetWinnings' | 'PushByOneDay' | 'Guess';
}

/** @name GuessTheNumberTrustedGetter */
export interface GuessTheNumberTrustedGetter extends Enum {
  readonly isAttempts: boolean;
  readonly asAttempts: AttemptsArg;
  readonly type: 'Attempts';
}

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
  readonly isSomeValue: boolean;
  readonly isTotalIssuance: boolean;
  readonly isUnusedIndex2: boolean;
  readonly isUnusedIndex3: boolean;
  readonly isUnusedIndex4: boolean;
  readonly isUnusedIndex5: boolean;
  readonly isUnusedIndex6: boolean;
  readonly isUnusedIndex7: boolean;
  readonly isUnusedIndex8: boolean;
  readonly isUnusedIndex9: boolean;
  readonly isParentchainsInfo: boolean;
  readonly isNoteBucketsInfo: boolean;
  readonly isUnusedIndex12: boolean;
  readonly isUnusedIndex13: boolean;
  readonly isUnusedIndex14: boolean;
  readonly isUnusedIndex15: boolean;
  readonly isUnusedIndex16: boolean;
  readonly isUnusedIndex17: boolean;
  readonly isUnusedIndex18: boolean;
  readonly isUnusedIndex19: boolean;
  readonly isUnusedIndex20: boolean;
  readonly isUnusedIndex21: boolean;
  readonly isUnusedIndex22: boolean;
  readonly isUnusedIndex23: boolean;
  readonly isUnusedIndex24: boolean;
  readonly isUnusedIndex25: boolean;
  readonly isUnusedIndex26: boolean;
  readonly isUnusedIndex27: boolean;
  readonly isUnusedIndex28: boolean;
  readonly isUnusedIndex29: boolean;
  readonly isUnusedIndex30: boolean;
  readonly isUnusedIndex31: boolean;
  readonly isUnusedIndex32: boolean;
  readonly isUnusedIndex33: boolean;
  readonly isUnusedIndex34: boolean;
  readonly isUnusedIndex35: boolean;
  readonly isUnusedIndex36: boolean;
  readonly isUnusedIndex37: boolean;
  readonly isUnusedIndex38: boolean;
  readonly isUnusedIndex39: boolean;
  readonly isUnusedIndex40: boolean;
  readonly isUnusedIndex41: boolean;
  readonly isUnusedIndex42: boolean;
  readonly isUnusedIndex43: boolean;
  readonly isUnusedIndex44: boolean;
  readonly isUnusedIndex45: boolean;
  readonly isUnusedIndex46: boolean;
  readonly isUnusedIndex47: boolean;
  readonly isUnusedIndex48: boolean;
  readonly isUnusedIndex49: boolean;
  readonly isGuessTheNumber: boolean;
  readonly asGuessTheNumber: GuessTheNumberPublicGetter;
  readonly type: 'SomeValue' | 'TotalIssuance' | 'UnusedIndex2' | 'UnusedIndex3' | 'UnusedIndex4' | 'UnusedIndex5' | 'UnusedIndex6' | 'UnusedIndex7' | 'UnusedIndex8' | 'UnusedIndex9' | 'ParentchainsInfo' | 'NoteBucketsInfo' | 'UnusedIndex12' | 'UnusedIndex13' | 'UnusedIndex14' | 'UnusedIndex15' | 'UnusedIndex16' | 'UnusedIndex17' | 'UnusedIndex18' | 'UnusedIndex19' | 'UnusedIndex20' | 'UnusedIndex21' | 'UnusedIndex22' | 'UnusedIndex23' | 'UnusedIndex24' | 'UnusedIndex25' | 'UnusedIndex26' | 'UnusedIndex27' | 'UnusedIndex28' | 'UnusedIndex29' | 'UnusedIndex30' | 'UnusedIndex31' | 'UnusedIndex32' | 'UnusedIndex33' | 'UnusedIndex34' | 'UnusedIndex35' | 'UnusedIndex36' | 'UnusedIndex37' | 'UnusedIndex38' | 'UnusedIndex39' | 'UnusedIndex40' | 'UnusedIndex41' | 'UnusedIndex42' | 'UnusedIndex43' | 'UnusedIndex44' | 'UnusedIndex45' | 'UnusedIndex46' | 'UnusedIndex47' | 'UnusedIndex48' | 'UnusedIndex49' | 'GuessTheNumber';
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
  readonly isBalanceTransferWithNote: boolean;
  readonly asBalanceTransferWithNote: BalanceTransferWithNoteArgs;
  readonly isUnusedIndex6: boolean;
  readonly isUnusedIndex7: boolean;
  readonly isUnusedIndex8: boolean;
  readonly isUnusedIndex9: boolean;
  readonly isUnusedIndex10: boolean;
  readonly isUnusedIndex11: boolean;
  readonly isUnusedIndex12: boolean;
  readonly isUnusedIndex13: boolean;
  readonly isUnusedIndex14: boolean;
  readonly isUnusedIndex15: boolean;
  readonly isUnusedIndex16: boolean;
  readonly isUnusedIndex17: boolean;
  readonly isUnusedIndex18: boolean;
  readonly isUnusedIndex19: boolean;
  readonly isSendNote: boolean;
  readonly asSendNote: SendNoteArgs;
  readonly isUnusedIndex21: boolean;
  readonly isUnusedIndex22: boolean;
  readonly isUnusedIndex23: boolean;
  readonly isUnusedIndex24: boolean;
  readonly isUnusedIndex25: boolean;
  readonly isUnusedIndex26: boolean;
  readonly isUnusedIndex27: boolean;
  readonly isUnusedIndex28: boolean;
  readonly isUnusedIndex29: boolean;
  readonly isAddSessionProxy: boolean;
  readonly asAddSessionProxy: AddSessionProxyArgs;
  readonly isUnusedIndex31: boolean;
  readonly isUnusedIndex32: boolean;
  readonly isUnusedIndex33: boolean;
  readonly isUnusedIndex34: boolean;
  readonly isUnusedIndex35: boolean;
  readonly isUnusedIndex36: boolean;
  readonly isUnusedIndex37: boolean;
  readonly isUnusedIndex38: boolean;
  readonly isUnusedIndex39: boolean;
  readonly isUnusedIndex40: boolean;
  readonly isUnusedIndex41: boolean;
  readonly isUnusedIndex42: boolean;
  readonly isUnusedIndex43: boolean;
  readonly isUnusedIndex44: boolean;
  readonly isUnusedIndex45: boolean;
  readonly isUnusedIndex46: boolean;
  readonly isUnusedIndex47: boolean;
  readonly isUnusedIndex48: boolean;
  readonly isUnusedIndex49: boolean;
  readonly isGuessTheNumber: boolean;
  readonly asGuessTheNumber: GuessTheNumberTrustedCall;
  readonly type: 'Noop' | 'TimestampSet' | 'BalanceTransfer' | 'BalanceUnshield' | 'BalanceShield' | 'BalanceTransferWithNote' | 'UnusedIndex6' | 'UnusedIndex7' | 'UnusedIndex8' | 'UnusedIndex9' | 'UnusedIndex10' | 'UnusedIndex11' | 'UnusedIndex12' | 'UnusedIndex13' | 'UnusedIndex14' | 'UnusedIndex15' | 'UnusedIndex16' | 'UnusedIndex17' | 'UnusedIndex18' | 'UnusedIndex19' | 'UnusedIndex20' | 'UnusedIndex21' | 'UnusedIndex22' | 'UnusedIndex23' | 'UnusedIndex24' | 'UnusedIndex25' | 'UnusedIndex26' | 'UnusedIndex27' | 'UnusedIndex28' | 'UnusedIndex29' | 'UnusedIndex30' | 'UnusedIndex31' | 'UnusedIndex32' | 'UnusedIndex33' | 'UnusedIndex34' | 'UnusedIndex35' | 'UnusedIndex36' | 'UnusedIndex37' | 'UnusedIndex38' | 'UnusedIndex39' | 'UnusedIndex40' | 'UnusedIndex41' | 'UnusedIndex42' | 'UnusedIndex43' | 'UnusedIndex44' | 'UnusedIndex45' | 'UnusedIndex46' | 'UnusedIndex47' | 'UnusedIndex48' | 'UnusedIndex49' | 'GuessTheNumber';
}

/** @name IntegriteeTrustedCallSigned */
export interface IntegriteeTrustedCallSigned extends Struct {
  readonly call: IntegriteeTrustedCall;
  readonly nonce: u32;
  readonly delegate: Option<AccountId>,
  readonly signature: MultiSignature;
}

/** @name IntegriteeTrustedGetter */
export interface IntegriteeTrustedGetter extends Enum {
  readonly isAccountInfo: boolean;
  readonly asAccountInfo: AccountId;
  readonly isAccountInfoAndSessionProxies: boolean;
  readonly asAccountInfoAndSessionProxies: AccountId;
  readonly isUnusedIndex1: boolean;
  readonly isUnusedIndex2: boolean;
  readonly isUnusedIndex3: boolean;
  readonly isUnusedIndex4: boolean;
  readonly isUnusedIndex5: boolean;
  readonly isUnusedIndex6: boolean;
  readonly isUnusedIndex7: boolean;
  readonly isUnusedIndex8: boolean;
  readonly isUnusedIndex9: boolean;
  readonly isNotesFor: boolean;
  readonly asNotesFor: NotesForArgs;
  readonly isUnusedIndex11: boolean;
  readonly isUnusedIndex12: boolean;
  readonly isUnusedIndex13: boolean;
  readonly isUnusedIndex14: boolean;
  readonly isUnusedIndex15: boolean;
  readonly isUnusedIndex16: boolean;
  readonly isUnusedIndex17: boolean;
  readonly isUnusedIndex18: boolean;
  readonly isUnusedIndex19: boolean;
  readonly isUnusedIndex20: boolean;
  readonly isUnusedIndex21: boolean;
  readonly isUnusedIndex22: boolean;
  readonly isUnusedIndex23: boolean;
  readonly isUnusedIndex24: boolean;
  readonly isUnusedIndex25: boolean;
  readonly isUnusedIndex26: boolean;
  readonly isUnusedIndex27: boolean;
  readonly isUnusedIndex28: boolean;
  readonly isUnusedIndex29: boolean;
  readonly isUnusedIndex30: boolean;
  readonly isUnusedIndex31: boolean;
  readonly isUnusedIndex32: boolean;
  readonly isUnusedIndex33: boolean;
  readonly isUnusedIndex34: boolean;
  readonly isUnusedIndex35: boolean;
  readonly isUnusedIndex36: boolean;
  readonly isUnusedIndex37: boolean;
  readonly isUnusedIndex38: boolean;
  readonly isUnusedIndex39: boolean;
  readonly isUnusedIndex40: boolean;
  readonly isUnusedIndex41: boolean;
  readonly isUnusedIndex42: boolean;
  readonly isUnusedIndex43: boolean;
  readonly isUnusedIndex44: boolean;
  readonly isUnusedIndex45: boolean;
  readonly isUnusedIndex46: boolean;
  readonly isUnusedIndex47: boolean;
  readonly isUnusedIndex48: boolean;
  readonly isUnusedIndex49: boolean;
  readonly isGuessTheNumber: boolean;
  readonly asGuessTheNumber: GuessTheNumberTrustedGetter;
  readonly type: 'AccountInfo' | 'UnusedIndex1' | 'UnusedIndex2' | 'UnusedIndex3' | 'UnusedIndex4' | 'UnusedIndex5' | 'UnusedIndex6' | 'UnusedIndex7' | 'UnusedIndex8' | 'UnusedIndex9' | 'NotesFor' | 'UnusedIndex11' | 'UnusedIndex12' | 'UnusedIndex13' | 'UnusedIndex14' | 'UnusedIndex15' | 'UnusedIndex16' | 'UnusedIndex17' | 'UnusedIndex18' | 'UnusedIndex19' | 'UnusedIndex20' | 'UnusedIndex21' | 'UnusedIndex22' | 'UnusedIndex23' | 'UnusedIndex24' | 'UnusedIndex25' | 'UnusedIndex26' | 'UnusedIndex27' | 'UnusedIndex28' | 'UnusedIndex29' | 'UnusedIndex30' | 'UnusedIndex31' | 'UnusedIndex32' | 'UnusedIndex33' | 'UnusedIndex34' | 'UnusedIndex35' | 'UnusedIndex36' | 'UnusedIndex37' | 'UnusedIndex38' | 'UnusedIndex39' | 'UnusedIndex40' | 'UnusedIndex41' | 'UnusedIndex42' | 'UnusedIndex43' | 'UnusedIndex44' | 'UnusedIndex45' | 'UnusedIndex46' | 'UnusedIndex47' | 'UnusedIndex48' | 'UnusedIndex49' | 'GuessTheNumber';
}

/** @name IntegriteeTrustedGetterSigned */
export interface IntegriteeTrustedGetterSigned extends Struct {
  readonly getter: IntegriteeTrustedGetter;
  readonly delegate: Option<AccountId>
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

/** @name NoteIndex */
export interface NoteIndex extends u64 {}

/** @name NotesBucketInfo */
export interface NotesBucketInfo extends Struct {
  readonly first: Option<BucketInfo>;
  readonly last: Option<BucketInfo>;
}

/** @name NotesForArgs */
export interface NotesForArgs extends ITuple<[AccountId, BucketIndex]> {}

/** @name TimestampedTrustedNote */
export interface TimestampedTrustedNote extends Struct {
  readonly timestamp: Moment;
  readonly version: u16;
  readonly note: TrustedNote;
}

/** @name TimestampSetArgs */
export interface TimestampSetArgs extends ITuple<[AccountId, H160, BalanceType]> {}

/** @name TrustedNote */
export interface TrustedNote extends Enum {
  readonly isSuccessfulTrustedCall: boolean;
  readonly asSuccessfulTrustedCall: Bytes;
  readonly isSgxRuntimeEvent: boolean;
  readonly asSgxRuntimeEvent: Bytes;
  readonly isText: boolean;
  readonly asText: Text;
  readonly type: 'SuccessfulTrustedCall' | 'SgxRuntimeEvent' | 'Text';
}

export type PHANTOM_INTEGRITEEWORKER = 'integriteeWorker';
