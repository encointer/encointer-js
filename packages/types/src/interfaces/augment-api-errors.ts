// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/errors';

import type { ApiTypes, AugmentedError } from '@polkadot/api-base/types';

export type __AugmentedError<ApiType extends ApiTypes> = AugmentedError<ApiType>;

declare module '@polkadot/api-base/types/errors' {
  interface AugmentedErrors<ApiType extends ApiTypes> {
    balances: {
      /**
       * Beneficiary account must pre-exist
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Balance too low to send value
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account
       **/
      KeepAlive: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Number of named reserves exceed MaxReserves
       **/
      TooManyReserves: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value
       **/
      VestingBalance: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    collective: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    cumulusXcm: {
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    dmpQueue: {
      /**
       * The amount of weight given is possibly not enough for executing the message.
       **/
      OverLimit: AugmentedError<ApiType>;
      /**
       * The message index given is unknown.
       **/
      Unknown: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    encointerBalances: {
      /**
       * the balance is too low to perform this action
       **/
      BalanceTooLow: AugmentedError<ApiType>;
      /**
       * Balance too low to create an account
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * Account to alter does not exist in community
       **/
      NoAccount: AugmentedError<ApiType>;
      /**
       * the total issuance would overflow
       **/
      TotalIssuanceOverflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    encointerBazaar: {
      /**
       * business already registered for this cid
       **/
      ExistingBusiness: AugmentedError<ApiType>;
      /**
       * business does not exist
       **/
      NonexistentBusiness: AugmentedError<ApiType>;
      /**
       * community identifier not found
       **/
      NonexistentCommunity: AugmentedError<ApiType>;
      /**
       * offering does not exist
       **/
      NonexistentOffering: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    encointerCeremonies: {
      /**
       * newbie is already endorsed
       **/
      AlreadyEndorsed: AugmentedError<ApiType>;
      /**
       * former attendance has not been verified or has already been linked to other account
       **/
      AttendanceUnverifiedOrAlreadyUsed: AugmentedError<ApiType>;
      /**
       * the action can only be performed during ATTESTING phase
       **/
      AttestationPhaseRequired: AugmentedError<ApiType>;
      /**
       * Attestations beyond time tolerance
       **/
      AttestationsBeyondTimeTolerance: AugmentedError<ApiType>;
      /**
       * verification of signature of attendee failed
       **/
      BadAttendeeSignature: AugmentedError<ApiType>;
      /**
       * verification of signature of attendee failed
       **/
      BadProofOfAttendanceSignature: AugmentedError<ApiType>;
      /**
       * CheckedMath operation error
       **/
      CheckedMath: AugmentedError<ApiType>;
      /**
       * the history for given ceremony index and community has been purged
       **/
      CommunityCeremonyHistoryPurged: AugmentedError<ApiType>;
      /**
       * Not possible to pay rewards in attestations phase
       **/
      EarlyRewardsNotPossible: AugmentedError<ApiType>;
      /**
       * Error while finding meetup participants
       **/
      GetMeetupParticipantsError: AugmentedError<ApiType>;
      /**
       * CommunityIdentifier not found
       **/
      InexistentCommunity: AugmentedError<ApiType>;
      /**
       * Meetup Index > Meetup Count or < 1
       **/
      InvalidMeetupIndex: AugmentedError<ApiType>;
      /**
       * MeetupTimeOffset needs to be in [-8h, 8h]
       **/
      InvalidMeetupTimeOffset: AugmentedError<ApiType>;
      /**
       * meetup location was not found
       **/
      MeetupLocationNotFound: AugmentedError<ApiType>;
      /**
       * meetup time calculation failed
       **/
      MeetupTimeCalculationError: AugmentedError<ApiType>;
      /**
       * index out of bounds while validating the meetup
       **/
      MeetupValidationIndexOutOfBounds: AugmentedError<ApiType>;
      /**
       * Only newbies can upgrade their registration
       **/
      MustBeNewbieToUpgradeRegistration: AugmentedError<ApiType>;
      /**
       * No locations are available for assigning participants
       **/
      NoLocationsAvailable: AugmentedError<ApiType>;
      /**
       * sender has run out of newbie tickets
       **/
      NoMoreNewbieTickets: AugmentedError<ApiType>;
      /**
       * no valid claims were supplied
       **/
      NoValidClaims: AugmentedError<ApiType>;
      /**
       * Only Bootstrappers are allowed to be registered at this time
       **/
      OnlyBootstrappers: AugmentedError<ApiType>;
      /**
       * origin not part of this meetup
       **/
      OriginNotParticipant: AugmentedError<ApiType>;
      /**
       * the participant is already registered
       **/
      ParticipantAlreadyRegistered: AugmentedError<ApiType>;
      /**
       * Participant is not registered
       **/
      ParticipantIsNotRegistered: AugmentedError<ApiType>;
      /**
       * proof is acausal
       **/
      ProofAcausal: AugmentedError<ApiType>;
      /**
       * proof is outdated
       **/
      ProofOutdated: AugmentedError<ApiType>;
      /**
       * the action can only be performed during REGISTERING or ATTESTING phase
       **/
      RegisteringOrAttestationPhaseRequired: AugmentedError<ApiType>;
      /**
       * the action can only be performed during REGISTERING phase
       **/
      RegisteringPhaseRequired: AugmentedError<ApiType>;
      /**
       * Overflow adding user to registry
       **/
      RegistryOverflow: AugmentedError<ApiType>;
      /**
       * To unregister as a reputable you need to provide a provide a community ceremony where you have a linked reputation
       **/
      ReputationCommunityCeremonyRequired: AugmentedError<ApiType>;
      /**
       * In order to unregister a reputable, the provided reputation must be linked
       **/
      ReputationMustBeLinked: AugmentedError<ApiType>;
      /**
       * Trying to issue rewards for a meetup for which UBI was already issued
       **/
      RewardsAlreadyIssued: AugmentedError<ApiType>;
      /**
       * can't have more attestations than other meetup participants
       **/
      TooManyAttestations: AugmentedError<ApiType>;
      /**
       * can't have more claims than other meetup participants
       **/
      TooManyClaims: AugmentedError<ApiType>;
      /**
       * Trying to claim UBI for a meetup where votes are not dependable
       **/
      VotesNotDependable: AugmentedError<ApiType>;
      /**
       * MeetupTimeOffset can only be changed during registering
       **/
      WrongPhaseForChangingMeetupTimeOffset: AugmentedError<ApiType>;
      /**
       * Trying to issue rewards in a phase that is not REGISTERING
       **/
      WrongPhaseForClaimingRewards: AugmentedError<ApiType>;
      /**
       * Unregistering can only be performed during the registering phase
       **/
      WrongPhaseForUnregistering: AugmentedError<ApiType>;
      /**
       * supplied proof is not proving sender
       **/
      WrongProofSubject: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    encointerCommunities: {
      /**
       * sender is not authorized
       **/
      BadOrigin: AugmentedError<ApiType>;
      /**
       * Can't register community that already exists
       **/
      CommunityAlreadyRegistered: AugmentedError<ApiType>;
      /**
       * Community does not exist yet
       **/
      CommunityInexistent: AugmentedError<ApiType>;
      /**
       * Invalid amount of bootstrappers supplied. Needs to be \[3, 12\]
       **/
      InvalidAmountBootstrappers: AugmentedError<ApiType>;
      /**
       * Invalid Metadata supplied
       **/
      InvalidCommunityMetadata: AugmentedError<ApiType>;
      /**
       * Invalid demurrage supplied
       **/
      InvalidDemurrage: AugmentedError<ApiType>;
      /**
       * Invalid Geohash provided
       **/
      InvalidGeohash: AugmentedError<ApiType>;
      /**
       * Location is not a valid geolocation
       **/
      InvalidLocation: AugmentedError<ApiType>;
      /**
       * Invalid location provided when computing geohash
       **/
      InvalidLocationForGeohash: AugmentedError<ApiType>;
      /**
       * Invalid demurrage supplied
       **/
      InvalidNominalIncome: AugmentedError<ApiType>;
      /**
       * minimum distance violated towards dateline
       **/
      MinimumDistanceViolationToDateLine: AugmentedError<ApiType>;
      /**
       * minimum distance violation to other location
       **/
      MinimumDistanceViolationToOtherLocation: AugmentedError<ApiType>;
      /**
       * Locations can only be added in Registration Phase
       **/
      RegistrationPhaseRequired: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    encointerScheduler: {
      /**
       * a division by zero occurred
       **/
      DivisionByZero: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    membership: {
      /**
       * Already a member.
       **/
      AlreadyMember: AugmentedError<ApiType>;
      /**
       * Not a member.
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Too many members.
       **/
      TooManyMembers: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    parachainSystem: {
      /**
       * The inherent which supplies the host configuration did not run this block
       **/
      HostConfigurationNotAvailable: AugmentedError<ApiType>;
      /**
       * No code upgrade has been authorized.
       **/
      NothingAuthorized: AugmentedError<ApiType>;
      /**
       * No validation function upgrade is currently scheduled.
       **/
      NotScheduled: AugmentedError<ApiType>;
      /**
       * Attempt to upgrade validation function while existing upgrade pending
       **/
      OverlappingUpgrades: AugmentedError<ApiType>;
      /**
       * Polkadot currently prohibits this parachain from upgrading its validation function
       **/
      ProhibitedByPolkadot: AugmentedError<ApiType>;
      /**
       * The supplied validation function has compiled into a blob larger than Polkadot is
       * willing to run
       **/
      TooBig: AugmentedError<ApiType>;
      /**
       * The given code upgrade has not been authorized.
       **/
      Unauthorized: AugmentedError<ApiType>;
      /**
       * The inherent which supplies the validation data did not run this block
       **/
      ValidationDataNotAvailable: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    polkadotXcm: {
      /**
       * The location is invalid since it already has a subscription from us.
       **/
      AlreadySubscribed: AugmentedError<ApiType>;
      /**
       * The given location could not be used (e.g. because it cannot be expressed in the
       * desired version of XCM).
       **/
      BadLocation: AugmentedError<ApiType>;
      /**
       * The version of the `Versioned` value used is not able to be interpreted.
       **/
      BadVersion: AugmentedError<ApiType>;
      /**
       * Could not re-anchor the assets to declare the fees for the destination chain.
       **/
      CannotReanchor: AugmentedError<ApiType>;
      /**
       * The destination `MultiLocation` provided cannot be inverted.
       **/
      DestinationNotInvertible: AugmentedError<ApiType>;
      /**
       * The assets to be sent are empty.
       **/
      Empty: AugmentedError<ApiType>;
      /**
       * The message execution fails the filter.
       **/
      Filtered: AugmentedError<ApiType>;
      /**
       * Origin is invalid for sending.
       **/
      InvalidOrigin: AugmentedError<ApiType>;
      /**
       * The referenced subscription could not be found.
       **/
      NoSubscription: AugmentedError<ApiType>;
      /**
       * There was some other issue (i.e. not to do with routing) in sending the message. Perhaps
       * a lack of space for buffering the message.
       **/
      SendFailure: AugmentedError<ApiType>;
      /**
       * Too many assets have been attempted for transfer.
       **/
      TooManyAssets: AugmentedError<ApiType>;
      /**
       * The desired destination was unreachable, generally because there is a no way of routing
       * to it.
       **/
      Unreachable: AugmentedError<ApiType>;
      /**
       * The message's weight could not be determined.
       **/
      UnweighableMessage: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    proxy: {
      /**
       * Account is already a proxy.
       **/
      Duplicate: AugmentedError<ApiType>;
      /**
       * Call may not be made by proxy because it may escalate its privileges.
       **/
      NoPermission: AugmentedError<ApiType>;
      /**
       * Cannot add self as proxy.
       **/
      NoSelfProxy: AugmentedError<ApiType>;
      /**
       * Proxy registration not found.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Sender is not a proxy of the account to be proxied.
       **/
      NotProxy: AugmentedError<ApiType>;
      /**
       * There are too many proxies registered or too many announcements pending.
       **/
      TooMany: AugmentedError<ApiType>;
      /**
       * Announcement, if made at all, was made too recently.
       **/
      Unannounced: AugmentedError<ApiType>;
      /**
       * A call which is incompatible with the proxy type's filter was attempted.
       **/
      Unproxyable: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    scheduler: {
      /**
       * Failed to schedule a call
       **/
      FailedToSchedule: AugmentedError<ApiType>;
      /**
       * Cannot find the scheduled call.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Reschedule failed because it does not change scheduled time.
       **/
      RescheduleNoChange: AugmentedError<ApiType>;
      /**
       * Given target block number is in the past.
       **/
      TargetBlockNumberInPast: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    system: {
      /**
       * The origin filter prevent the call to be dispatched.
       **/
      CallFiltered: AugmentedError<ApiType>;
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    treasury: {
      /**
       * The spend origin is valid but the amount it is allowed to spend is lower than the
       * amount to be spent.
       **/
      InsufficientPermission: AugmentedError<ApiType>;
      /**
       * Proposer's balance is too low.
       **/
      InsufficientProposersBalance: AugmentedError<ApiType>;
      /**
       * No proposal or bounty at that index.
       **/
      InvalidIndex: AugmentedError<ApiType>;
      /**
       * Proposal has not been approved.
       **/
      ProposalNotApproved: AugmentedError<ApiType>;
      /**
       * Too many approvals in the queue.
       **/
      TooManyApprovals: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    utility: {
      /**
       * Too many calls batched.
       **/
      TooManyCalls: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    xcmpQueue: {
      /**
       * Bad overweight index.
       **/
      BadOverweightIndex: AugmentedError<ApiType>;
      /**
       * Bad XCM data.
       **/
      BadXcm: AugmentedError<ApiType>;
      /**
       * Bad XCM origin.
       **/
      BadXcmOrigin: AugmentedError<ApiType>;
      /**
       * Failed to send XCM message.
       **/
      FailedToSend: AugmentedError<ApiType>;
      /**
       * Provided weight is possibly not enough to execute the message.
       **/
      WeightOverLimit: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
  } // AugmentedErrors
} // declare module
