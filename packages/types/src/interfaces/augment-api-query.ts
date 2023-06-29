// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/storage';

import type { ApiTypes, AugmentedQuery, QueryableStorageEntry } from '@polkadot/api-base/types';
import type { BTreeMap, Bytes, Null, Option, Vec, bool, i32, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { AnyNumber, ITuple } from '@polkadot/types-codec/types';
import type { AccountId32, Call, H256 } from '@polkadot/types/interfaces/runtime';
import type { Observable } from '@polkadot/types/types';

export type __AugmentedQuery<ApiType extends ApiTypes> = AugmentedQuery<ApiType, () => unknown>;
export type __QueryableStorageEntry<ApiType extends ApiTypes> = QueryableStorageEntry<ApiType>;

declare module '@polkadot/api-base/types/storage' {
  interface AugmentedQueries<ApiType extends ApiTypes> {
    assetTxPayment: {
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    aura: {
      /**
       * The current authority set.
       **/
      authorities: AugmentedQuery<ApiType, () => Observable<Vec<SpConsensusAuraSr25519AppSr25519Public>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The current slot of this block.
       * 
       * This will be set in `on_initialize`.
       **/
      currentSlot: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    auraExt: {
      /**
       * Serves as cache for the authorities.
       * 
       * The authorities in AuRa are overwritten in `on_initialize` when we switch to a new session,
       * but we require the old authorities to verify the seal when validating a PoV. This will always
       * be updated to the latest AuRa authorities in `on_finalize`.
       **/
      authorities: AugmentedQuery<ApiType, () => Observable<Vec<SpConsensusAuraSr25519AppSr25519Public>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    balances: {
      /**
       * The Balances pallet example of storing the balance of an account.
       * 
       * # Example
       * 
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
       * }
       * ```
       * 
       * You can also store the balance of an account in the `System` pallet.
       * 
       * # Example
       * 
       * ```nocompile
       * impl pallet_balances::Config for Runtime {
       * type AccountStore = System
       * }
       * ```
       * 
       * But this comes with tradeoffs, storing account balances in the system pallet stores
       * `frame_system` data alongside the account data contrary to storing account balances in the
       * `Balances` pallet, which uses a `StorageMap` to store balances data only.
       * NOTE: This is only used in the case that this pallet is used to store balances.
       **/
      account: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<PalletBalancesAccountData>, [AccountId32]> & QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Any liquidity locks on some account balances.
       * NOTE: Should only be accessed when setting, changing and freeing a lock.
       **/
      locks: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<PalletBalancesBalanceLock>>, [AccountId32]> & QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Named reserves on some account balances.
       **/
      reserves: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<Vec<PalletBalancesReserveData>>, [AccountId32]> & QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Storage version of the pallet.
       * 
       * This is set to v2.0.0 for new networks.
       **/
      storageVersion: AugmentedQuery<ApiType, () => Observable<PalletBalancesReleases>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The total units issued in the system.
       **/
      totalIssuance: AugmentedQuery<ApiType, () => Observable<u128>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    collective: {
      /**
       * The current members of the collective. This is stored sorted (just by value).
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The prime member that helps determine the default vote behavior in case of absentations.
       **/
      prime: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Proposals so far.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Actual proposal for a given hash, if it's current.
       **/
      proposalOf: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<Call>>, [H256]> & QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The hashes of the active proposals.
       **/
      proposals: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Votes on a given proposal, if it is ongoing.
       **/
      voting: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Option<PalletCollectiveVotes>>, [H256]> & QueryableStorageEntry<ApiType, [H256]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    dmpQueue: {
      /**
       * The configuration.
       **/
      configuration: AugmentedQuery<ApiType, () => Observable<CumulusPalletDmpQueueConfigData>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The overweight messages.
       **/
      overweight: AugmentedQuery<ApiType, (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<ITuple<[u32, Bytes]>>>, [u64]> & QueryableStorageEntry<ApiType, [u64]>;
      /**
       * The page index.
       **/
      pageIndex: AugmentedQuery<ApiType, () => Observable<CumulusPalletDmpQueuePageIndexData>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The queue pages.
       **/
      pages: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Vec<ITuple<[u32, Bytes]>>>, [u32]> & QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    encointerBalances: {
      balance: AugmentedQuery<ApiType, (arg1: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<EncointerPrimitivesBalancesBalanceEntry>, [EncointerPrimitivesCommunitiesCommunityIdentifier, AccountId32]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier, AccountId32]>;
      demurragePerBlock: AugmentedQuery<ApiType, (arg: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array) => Observable<SubstrateFixedFixedI128>, [EncointerPrimitivesCommunitiesCommunityIdentifier]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier]>;
      feeConversionFactor: AugmentedQuery<ApiType, () => Observable<u128>, []> & QueryableStorageEntry<ApiType, []>;
      totalIssuance: AugmentedQuery<ApiType, (arg: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array) => Observable<EncointerPrimitivesBalancesBalanceEntry>, [EncointerPrimitivesCommunitiesCommunityIdentifier]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    encointerBazaar: {
      businessRegistry: AugmentedQuery<ApiType, (arg1: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<EncointerPrimitivesBazaarBusinessData>, [EncointerPrimitivesCommunitiesCommunityIdentifier, AccountId32]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier, AccountId32]>;
      offeringRegistry: AugmentedQuery<ApiType, (arg1: EncointerPrimitivesBazaarBusinessIdentifier | { communityIdentifier?: any; controller?: any } | string | Uint8Array, arg2: u32 | AnyNumber | Uint8Array) => Observable<EncointerPrimitivesBazaarOfferingData>, [EncointerPrimitivesBazaarBusinessIdentifier, u32]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesBazaarBusinessIdentifier, u32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    encointerCeremonies: {
      assignmentCounts: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<EncointerPrimitivesCeremoniesAssignmentCount>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      assignments: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<EncointerPrimitivesCeremoniesAssignment>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      attestationCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      attestationIndex: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      attestationRegistry: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: u64 | AnyNumber | Uint8Array) => Observable<Option<Vec<AccountId32>>>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]>;
      bootstrapperCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      bootstrapperIndex: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      bootstrapperRegistry: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: u64 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]>;
      burnedBootstrapperNewbieTickets: AugmentedQuery<ApiType, (arg1: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, arg2: AccountId32 | string | Uint8Array) => Observable<u8>, [EncointerPrimitivesCommunitiesCommunityIdentifier, AccountId32]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier, AccountId32]>;
      burnedReputableNewbieTickets: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u8>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      /**
       * the default UBI for a ceremony attendee if no community specific value is set.
       **/
      ceremonyReward: AugmentedQuery<ApiType, () => Observable<SubstrateFixedFixedI128>, []> & QueryableStorageEntry<ApiType, []>;
      endorseeCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      endorseeIndex: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      endorseeRegistry: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: u64 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]>;
      /**
       * Accounts that have been endorsed by a reputable or a bootstrapper.
       * 
       * This is not the same as `EndorseeRegistry`, which contains the `Endorsees` who
       * have registered for a meetup.
       **/
      endorsees: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<Null>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      endorseesCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      /**
       * The number of newbies a bootstrapper can endorse to accelerate community growth
       **/
      endorsementTicketsPerBootstrapper: AugmentedQuery<ApiType, () => Observable<u8>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The number of newbies a reputable can endorse per cycle to accelerate community growth
       **/
      endorsementTicketsPerReputable: AugmentedQuery<ApiType, () => Observable<u8>, []> & QueryableStorageEntry<ApiType, []>;
      inactivityCounters: AugmentedQuery<ApiType, (arg: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array) => Observable<Option<u32>>, [EncointerPrimitivesCommunitiesCommunityIdentifier]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier]>;
      /**
       * The number of ceremony cycles a community can skip ceremonies before it gets purged
       **/
      inactivityTimeout: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      issuedRewards: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: u64 | AnyNumber | Uint8Array) => Observable<Option<EncointerPrimitivesCeremoniesMeetupResult>>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]>;
      locationTolerance: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      meetupCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      meetupParticipantCountVote: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u32>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      meetupTimeOffset: AugmentedQuery<ApiType, () => Observable<i32>, []> & QueryableStorageEntry<ApiType, []>;
      newbieCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      newbieIndex: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      newbieRegistry: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: u64 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]>;
      participantReputation: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<EncointerPrimitivesCeremoniesReputation>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      reputableCount: AugmentedQuery<ApiType, (arg: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array]) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>]>;
      reputableIndex: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: AccountId32 | string | Uint8Array) => Observable<u64>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, AccountId32]>;
      reputableRegistry: AugmentedQuery<ApiType, (arg1: ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]> | [EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, u32 | AnyNumber | Uint8Array], arg2: u64 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]> & QueryableStorageEntry<ApiType, [ITuple<[EncointerPrimitivesCommunitiesCommunityIdentifier, u32]>, u64]>;
      /**
       * The number of ceremony cycles that a participant's reputation is valid for
       **/
      reputationLifetime: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      timeTolerance: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    encointerCommunities: {
      bootstrappers: AugmentedQuery<ApiType, (arg: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array) => Observable<Vec<AccountId32>>, [EncointerPrimitivesCommunitiesCommunityIdentifier]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier]>;
      communityIdentifiers: AugmentedQuery<ApiType, () => Observable<Vec<EncointerPrimitivesCommunitiesCommunityIdentifier>>, []> & QueryableStorageEntry<ApiType, []>;
      communityIdentifiersByGeohash: AugmentedQuery<ApiType, (arg: GeoHash | string | Uint8Array) => Observable<Vec<EncointerPrimitivesCommunitiesCommunityIdentifier>>, [GeoHash]> & QueryableStorageEntry<ApiType, [GeoHash]>;
      communityMetadata: AugmentedQuery<ApiType, (arg: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array) => Observable<EncointerPrimitivesCommunitiesCommunityMetadata>, [EncointerPrimitivesCommunitiesCommunityIdentifier]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier]>;
      locations: AugmentedQuery<ApiType, (arg1: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array, arg2: GeoHash | string | Uint8Array) => Observable<Vec<EncointerPrimitivesCommunitiesLocation>>, [EncointerPrimitivesCommunitiesCommunityIdentifier, GeoHash]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier, GeoHash]>;
      maxSpeedMps: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      minSolarTripTimeS: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Amount of UBI to be paid for every attended ceremony.
       **/
      nominalIncome: AugmentedQuery<ApiType, (arg: EncointerPrimitivesCommunitiesCommunityIdentifier | { geohash?: any; digest?: any } | string | Uint8Array) => Observable<SubstrateFixedFixedI128>, [EncointerPrimitivesCommunitiesCommunityIdentifier]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesCommunitiesCommunityIdentifier]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    encointerScheduler: {
      currentCeremonyIndex: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      currentPhase: AugmentedQuery<ApiType, () => Observable<EncointerPrimitivesSchedulerCeremonyPhaseType>, []> & QueryableStorageEntry<ApiType, []>;
      lastCeremonyBlock: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      nextPhaseTimestamp: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      phaseDurations: AugmentedQuery<ApiType, (arg: EncointerPrimitivesSchedulerCeremonyPhaseType | 'Registering' | 'Assigning' | 'Attesting' | number | Uint8Array) => Observable<u64>, [EncointerPrimitivesSchedulerCeremonyPhaseType]> & QueryableStorageEntry<ApiType, [EncointerPrimitivesSchedulerCeremonyPhaseType]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    membership: {
      /**
       * The current membership, stored as an ordered Vec.
       **/
      members: AugmentedQuery<ApiType, () => Observable<Vec<AccountId32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The current prime member, if one exists.
       **/
      prime: AugmentedQuery<ApiType, () => Observable<Option<AccountId32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    parachainInfo: {
      parachainId: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    parachainSystem: {
      /**
       * The number of HRMP messages we observed in `on_initialize` and thus used that number for
       * announcing the weight of `on_initialize` and `on_finalize`.
       **/
      announcedHrmpMessagesPerCandidate: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The next authorized upgrade, if there is one.
       **/
      authorizedUpgrade: AugmentedQuery<ApiType, () => Observable<Option<H256>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * A custom head data that should be returned as result of `validate_block`.
       * 
       * See [`Pallet::set_custom_validation_head_data`] for more information.
       **/
      customValidationHeadData: AugmentedQuery<ApiType, () => Observable<Option<Bytes>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Were the validation data set to notify the relay chain?
       **/
      didSetValidationCode: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The parachain host configuration that was obtained from the relay parent.
       * 
       * This field is meant to be updated each block with the validation data inherent. Therefore,
       * before processing of the inherent, e.g. in `on_initialize` this data may be stale.
       * 
       * This data is also absent from the genesis.
       **/
      hostConfiguration: AugmentedQuery<ApiType, () => Observable<Option<PolkadotPrimitivesV2AbridgedHostConfiguration>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * HRMP messages that were sent in a block.
       * 
       * This will be cleared in `on_initialize` of each new block.
       **/
      hrmpOutboundMessages: AugmentedQuery<ApiType, () => Observable<Vec<PolkadotCorePrimitivesOutboundHrmpMessage>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * HRMP watermark that was set in a block.
       * 
       * This will be cleared in `on_initialize` of each new block.
       **/
      hrmpWatermark: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The last downward message queue chain head we have observed.
       * 
       * This value is loaded before and saved after processing inbound downward messages carried
       * by the system inherent.
       **/
      lastDmqMqcHead: AugmentedQuery<ApiType, () => Observable<H256>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The message queue chain heads we have observed per each channel incoming channel.
       * 
       * This value is loaded before and saved after processing inbound downward messages carried
       * by the system inherent.
       **/
      lastHrmpMqcHeads: AugmentedQuery<ApiType, () => Observable<BTreeMap<u32, H256>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The relay chain block number associated with the last parachain block.
       **/
      lastRelayChainBlockNumber: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Validation code that is set by the parachain and is to be communicated to collator and
       * consequently the relay-chain.
       * 
       * This will be cleared in `on_initialize` of each new block if no other pallet already set
       * the value.
       **/
      newValidationCode: AugmentedQuery<ApiType, () => Observable<Option<Bytes>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Upward messages that are still pending and not yet send to the relay chain.
       **/
      pendingUpwardMessages: AugmentedQuery<ApiType, () => Observable<Vec<Bytes>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * In case of a scheduled upgrade, this storage field contains the validation code to be applied.
       * 
       * As soon as the relay chain gives us the go-ahead signal, we will overwrite the [`:code`][well_known_keys::CODE]
       * which will result the next block process with the new validation code. This concludes the upgrade process.
       * 
       * [well_known_keys::CODE]: sp_core::storage::well_known_keys::CODE
       **/
      pendingValidationCode: AugmentedQuery<ApiType, () => Observable<Bytes>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Number of downward messages processed in a block.
       * 
       * This will be cleared in `on_initialize` of each new block.
       **/
      processedDownwardMessages: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The state proof for the last relay parent block.
       * 
       * This field is meant to be updated each block with the validation data inherent. Therefore,
       * before processing of the inherent, e.g. in `on_initialize` this data may be stale.
       * 
       * This data is also absent from the genesis.
       **/
      relayStateProof: AugmentedQuery<ApiType, () => Observable<Option<SpTrieStorageProof>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The snapshot of some state related to messaging relevant to the current parachain as per
       * the relay parent.
       * 
       * This field is meant to be updated each block with the validation data inherent. Therefore,
       * before processing of the inherent, e.g. in `on_initialize` this data may be stale.
       * 
       * This data is also absent from the genesis.
       **/
      relevantMessagingState: AugmentedQuery<ApiType, () => Observable<Option<CumulusPalletParachainSystemRelayStateSnapshotMessagingStateSnapshot>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The weight we reserve at the beginning of the block for processing DMP messages. This
       * overrides the amount set in the Config trait.
       **/
      reservedDmpWeightOverride: AugmentedQuery<ApiType, () => Observable<Option<u64>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The weight we reserve at the beginning of the block for processing XCMP messages. This
       * overrides the amount set in the Config trait.
       **/
      reservedXcmpWeightOverride: AugmentedQuery<ApiType, () => Observable<Option<u64>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * An option which indicates if the relay-chain restricts signalling a validation code upgrade.
       * In other words, if this is `Some` and [`NewValidationCode`] is `Some` then the produced
       * candidate will be invalid.
       * 
       * This storage item is a mirror of the corresponding value for the current parachain from the
       * relay-chain. This value is ephemeral which means it doesn't hit the storage. This value is
       * set after the inherent.
       **/
      upgradeRestrictionSignal: AugmentedQuery<ApiType, () => Observable<Option<PolkadotPrimitivesV2UpgradeRestriction>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Upward messages that were sent in a block.
       * 
       * This will be cleared in `on_initialize` of each new block.
       **/
      upwardMessages: AugmentedQuery<ApiType, () => Observable<Vec<Bytes>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The [`PersistedValidationData`] set for this block.
       * This value is expected to be set only once per block and it's never stored
       * in the trie.
       **/
      validationData: AugmentedQuery<ApiType, () => Observable<Option<PolkadotPrimitivesV2PersistedValidationData>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    polkadotXcm: {
      /**
       * The existing asset traps.
       * 
       * Key is the blake2 256 hash of (origin, versioned `MultiAssets`) pair. Value is the number of
       * times this pair has been trapped (usually just 1 if it exists at all).
       **/
      assetTraps: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<u32>, [H256]> & QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The current migration's stage, if any.
       **/
      currentMigration: AugmentedQuery<ApiType, () => Observable<Option<PalletXcmVersionMigrationStage>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The ongoing queries.
       **/
      queries: AugmentedQuery<ApiType, (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<PalletXcmQueryStatus>>, [u64]> & QueryableStorageEntry<ApiType, [u64]>;
      /**
       * The latest available query index.
       **/
      queryCounter: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Default version to encode XCM when latest version of destination is unknown. If `None`,
       * then the destinations whose XCM version is unknown are considered unreachable.
       **/
      safeXcmVersion: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The Latest versions that we know various locations support.
       **/
      supportedVersion: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array) => Observable<Option<u32>>, [u32, XcmVersionedMultiLocation]> & QueryableStorageEntry<ApiType, [u32, XcmVersionedMultiLocation]>;
      /**
       * Destinations whose latest XCM version we would like to know. Duplicates not allowed, and
       * the `u32` counter is the number of times that a send to the destination has been attempted,
       * which is used as a prioritization.
       **/
      versionDiscoveryQueue: AugmentedQuery<ApiType, () => Observable<Vec<ITuple<[XcmVersionedMultiLocation, u32]>>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * All locations that we have requested version notifications from.
       **/
      versionNotifiers: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array) => Observable<Option<u64>>, [u32, XcmVersionedMultiLocation]> & QueryableStorageEntry<ApiType, [u32, XcmVersionedMultiLocation]>;
      /**
       * The target locations that are subscribed to our version changes, as well as the most recent
       * of our versions we informed them of.
       **/
      versionNotifyTargets: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: XcmVersionedMultiLocation | { V0: any } | { V1: any } | string | Uint8Array) => Observable<Option<ITuple<[u64, u64, u32]>>>, [u32, XcmVersionedMultiLocation]> & QueryableStorageEntry<ApiType, [u32, XcmVersionedMultiLocation]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    proxy: {
      /**
       * The announcements made by the proxy (key).
       **/
      announcements: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<ITuple<[Vec<PalletProxyAnnouncement>, u128]>>, [AccountId32]> & QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * The set of account proxies. Maps the account which has delegated to the accounts
       * which are being delegated to, together with the amount held on deposit.
       **/
      proxies: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<ITuple<[Vec<PalletProxyProxyDefinition>, u128]>>, [AccountId32]> & QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    randomnessCollectiveFlip: {
      /**
       * Series of block headers from the last 81 blocks that acts as random seed material. This
       * is arranged as a ring buffer with `block_number % 81` being the index into the `Vec` of
       * the oldest hash.
       **/
      randomMaterial: AugmentedQuery<ApiType, () => Observable<Vec<H256>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    scheduler: {
      /**
       * Items to be executed, indexed by the block number that they should be executed on.
       **/
      agenda: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Vec<Option<PalletSchedulerScheduledV3>>>, [u32]> & QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Lookup from identity to the block number and index of the task.
       **/
      lookup: AugmentedQuery<ApiType, (arg: Bytes | string | Uint8Array) => Observable<Option<ITuple<[u32, u32]>>>, [Bytes]> & QueryableStorageEntry<ApiType, [Bytes]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    system: {
      /**
       * The full account information for a particular account ID.
       **/
      account: AugmentedQuery<ApiType, (arg: AccountId32 | string | Uint8Array) => Observable<FrameSystemAccountInfo>, [AccountId32]> & QueryableStorageEntry<ApiType, [AccountId32]>;
      /**
       * Total length (in bytes) for all extrinsics put together, for the current block.
       **/
      allExtrinsicsLen: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Map of block numbers to block hashes.
       **/
      blockHash: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<H256>, [u32]> & QueryableStorageEntry<ApiType, [u32]>;
      /**
       * The current weight for the block.
       **/
      blockWeight: AugmentedQuery<ApiType, () => Observable<FrameSupportWeightsPerDispatchClassU64>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Digest of the current block, also part of the block header.
       **/
      digest: AugmentedQuery<ApiType, () => Observable<SpRuntimeDigest>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The number of events in the `Events<T>` list.
       **/
      eventCount: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Events deposited for the current block.
       * 
       * NOTE: The item is unbound and should therefore never be read on chain.
       * It could otherwise inflate the PoV size of a block.
       * 
       * Events have a large in-memory size. Box the events to not go out-of-memory
       * just in case someone still reads them from within the runtime.
       **/
      events: AugmentedQuery<ApiType, () => Observable<Vec<FrameSystemEventRecord>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Mapping between a topic (represented by T::Hash) and a vector of indexes
       * of events in the `<Events<T>>` list.
       * 
       * All topic vectors have deterministic storage locations depending on the topic. This
       * allows light-clients to leverage the changes trie storage tracking mechanism and
       * in case of changes fetch the list of events of interest.
       * 
       * The value has the type `(T::BlockNumber, EventIndex)` because if we used only just
       * the `EventIndex` then in case if the topic has the same contents on the next block
       * no notification will be triggered thus the event might be lost.
       **/
      eventTopics: AugmentedQuery<ApiType, (arg: H256 | string | Uint8Array) => Observable<Vec<ITuple<[u32, u32]>>>, [H256]> & QueryableStorageEntry<ApiType, [H256]>;
      /**
       * The execution phase of the block.
       **/
      executionPhase: AugmentedQuery<ApiType, () => Observable<Option<FrameSystemPhase>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Total extrinsics count for the current block.
       **/
      extrinsicCount: AugmentedQuery<ApiType, () => Observable<Option<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Extrinsics data for the current block (maps an extrinsic's index to its data).
       **/
      extrinsicData: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>, [u32]> & QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Stores the `spec_version` and `spec_name` of when the last runtime upgrade happened.
       **/
      lastRuntimeUpgrade: AugmentedQuery<ApiType, () => Observable<Option<FrameSystemLastRuntimeUpgradeInfo>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The current block number being processed. Set by `execute_block`.
       **/
      number: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Hash of the previous block.
       **/
      parentHash: AugmentedQuery<ApiType, () => Observable<H256>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * True if we have upgraded so that AccountInfo contains three types of `RefCount`. False
       * (default) if not.
       **/
      upgradedToTripleRefCount: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * True if we have upgraded so that `type RefCount` is `u32`. False (default) if not.
       **/
      upgradedToU32RefCount: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    timestamp: {
      /**
       * Did the timestamp get updated in this block?
       **/
      didUpdate: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Current time for the current block.
       **/
      now: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    transactionPayment: {
      nextFeeMultiplier: AugmentedQuery<ApiType, () => Observable<u128>, []> & QueryableStorageEntry<ApiType, []>;
      storageVersion: AugmentedQuery<ApiType, () => Observable<PalletTransactionPaymentReleases>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    treasury: {
      /**
       * Proposal indices that have been approved but not yet awarded.
       **/
      approvals: AugmentedQuery<ApiType, () => Observable<Vec<u32>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Number of proposals that have been made.
       **/
      proposalCount: AugmentedQuery<ApiType, () => Observable<u32>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Proposals that have been made.
       **/
      proposals: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Option<PalletTreasuryProposal>>, [u32]> & QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
    xcmpQueue: {
      /**
       * Inbound aggregate XCMP messages. It can only be one per ParaId/block.
       **/
      inboundXcmpMessages: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: u32 | AnyNumber | Uint8Array) => Observable<Bytes>, [u32, u32]> & QueryableStorageEntry<ApiType, [u32, u32]>;
      /**
       * Status of the inbound XCMP channels.
       **/
      inboundXcmpStatus: AugmentedQuery<ApiType, () => Observable<Vec<CumulusPalletXcmpQueueInboundChannelDetails>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The messages outbound in a given XCMP channel.
       **/
      outboundXcmpMessages: AugmentedQuery<ApiType, (arg1: u32 | AnyNumber | Uint8Array, arg2: u16 | AnyNumber | Uint8Array) => Observable<Bytes>, [u32, u16]> & QueryableStorageEntry<ApiType, [u32, u16]>;
      /**
       * The non-empty XCMP channels in order of becoming non-empty, and the index of the first
       * and last outbound message. If the two indices are equal, then it indicates an empty
       * queue and there must be a non-`Ok` `OutboundStatus`. We assume queues grow no greater
       * than 65535 items. Queue indices for normal messages begin at one; zero is reserved in
       * case of the need to send a high-priority signal message this block.
       * The bool is true if there is a signal message waiting to be sent.
       **/
      outboundXcmpStatus: AugmentedQuery<ApiType, () => Observable<Vec<CumulusPalletXcmpQueueOutboundChannelDetails>>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The messages that exceeded max individual message weight budget.
       * 
       * These message stay in this storage map until they are manually dispatched via
       * `service_overweight`.
       **/
      overweight: AugmentedQuery<ApiType, (arg: u64 | AnyNumber | Uint8Array) => Observable<Option<ITuple<[u32, u32, Bytes]>>>, [u64]> & QueryableStorageEntry<ApiType, [u64]>;
      /**
       * The number of overweight messages ever recorded in `Overweight`. Also doubles as the next
       * available free overweight index.
       **/
      overweightCount: AugmentedQuery<ApiType, () => Observable<u64>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * The configuration which controls the dynamics of the outbound queue.
       **/
      queueConfig: AugmentedQuery<ApiType, () => Observable<CumulusPalletXcmpQueueQueueConfigData>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Whether or not the XCMP queue is suspended from executing incoming XCMs or not.
       **/
      queueSuspended: AugmentedQuery<ApiType, () => Observable<bool>, []> & QueryableStorageEntry<ApiType, []>;
      /**
       * Any signal messages waiting to be sent.
       **/
      signalMessages: AugmentedQuery<ApiType, (arg: u32 | AnyNumber | Uint8Array) => Observable<Bytes>, [u32]> & QueryableStorageEntry<ApiType, [u32]>;
      /**
       * Generic query
       **/
      [key: string]: QueryableStorageEntry<ApiType>;
    };
  } // AugmentedQueries
} // declare module
