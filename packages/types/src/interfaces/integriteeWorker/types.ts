// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { BalanceType } from '@encointer/types/interfaces/balances';
import type { CommunityIdentifier } from '@encointer/types/interfaces/community';
import type { ParentchainId, ShardIdentifier } from '@encointer/types/interfaces/worker';
import type { Enum, Struct, u32 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { MultiSignature } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId, H160 } from '@polkadot/types/interfaces/runtime';

/** @name BalanceSetBalanceArgs */
export interface BalanceSetBalanceArgs extends ITuple<[AccountId, AccountId, BalanceType, BalanceType]> {}

/** @name BalanceShieldArgs */
export interface BalanceShieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ParentchainId]> {}

/** @name BalanceTransferArgs */
export interface BalanceTransferArgs extends ITuple<[AccountId, AccountId, BalanceType]> {}

/** @name BalanceUnshieldArgs */
export interface BalanceUnshieldArgs extends ITuple<[AccountId, AccountId, BalanceType, ShardIdentifier]> {}

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
  readonly isTotalIssuance: boolean;
  readonly asTotalIssuance: CommunityIdentifier;
  readonly isParticipantCount: boolean;
  readonly asParticipantCount: CommunityIdentifier;
  readonly isMeetupCount: boolean;
  readonly asMeetupCount: CommunityIdentifier;
  readonly isCeremonyReward: boolean;
  readonly asCeremonyReward: CommunityIdentifier;
  readonly isLocationTolerance: boolean;
  readonly asLocationTolerance: CommunityIdentifier;
  readonly isTimeTolerance: boolean;
  readonly asTimeTolerance: CommunityIdentifier;
  readonly isSchedulerState: boolean;
  readonly asSchedulerState: CommunityIdentifier;
  readonly type: 'TotalIssuance' | 'ParticipantCount' | 'MeetupCount' | 'CeremonyReward' | 'LocationTolerance' | 'TimeTolerance' | 'SchedulerState';
}

/** @name IntegriteeTrustedCall */
export interface IntegriteeTrustedCall extends Enum {
  readonly isNoop: boolean;
  readonly asNoop: AccountId;
  readonly isBalanceSetBalance: boolean;
  readonly asBalanceSetBalance: BalanceSetBalanceArgs;
  readonly isBalanceTransfer: boolean;
  readonly asBalanceTransfer: BalanceTransferArgs;
  readonly isBalanceUnshield: boolean;
  readonly asBalanceUnshield: BalanceUnshieldArgs;
  readonly isBalanceShield: boolean;
  readonly asBalanceShield: BalanceShieldArgs;
  readonly isTimestampSet: boolean;
  readonly asTimestampSet: TimestampSetArgs;
  readonly type: 'Noop' | 'BalanceSetBalance' | 'BalanceTransfer' | 'BalanceUnshield' | 'BalanceShield' | 'TimestampSet';
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
