import {ApiPromise} from "@polkadot/api";
import {
    Assignment,
    AssignmentCount, AssignmentParams,
    CeremonyIndexType, CeremonyPhaseType,
    CommunityIdentifier, Demurrage, FixedI64F64, Location,
    MeetupIndexType, NominalIncomeType, ParticipantIndexType,
} from "@encointer/types";
import {meetupIndex, meetupLocation, assignmentFnInverse, meetupTime} from "@encointer/util/assignment";
import {Vec} from "@polkadot/types";
import {AccountId, Moment} from "@polkadot/types/interfaces/runtime";
import {Registry} from "@polkadot/types/types";
import {IndexRegistry, IParticipantIndexQuery} from "@encointer/node-api/interface";

export async function getAssignment(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<Assignment> {
    return api.query.encointerCeremonies.assignments<Assignment>([cid, cIndex]);
}

export async function getAssignmentCount(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<AssignmentCount> {
    return api.query.encointerCeremonies.assignmentCounts<AssignmentCount>([cid, cIndex]);
}

export async function getMeetupCount(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<MeetupIndexType> {
    return api.query.encointerCeremonies.meetupCount<MeetupIndexType>([cid, cIndex]);
}

export async function getMeetupIndex(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<MeetupIndexType> {
    const registry = api.registry;

    // helper query to make below code more readable
    const indexQuery = participantIndexQuery(api, cid, cIndex, address);

    // query everything in parallel to speed up process.
    const [mCount, assignments, assignmentCount, ...pIndexes] = await Promise.all([
        getMeetupCount(api, cid, cIndex),
        getAssignment(api, cid, cIndex),
        getAssignmentCount(api, cid, cIndex),
        indexQuery(IndexRegistry.Bootstrapper),
        indexQuery(IndexRegistry.Reputable),
        indexQuery(IndexRegistry.Endorsee),
        indexQuery(IndexRegistry.Newbie),
    ]);

    if (mCount.eq(0)) {
        // 0 index means not registered
        return mCount;
    }

    const meetupIndexFn =
        (pIndex: ParticipantIndexType, params: AssignmentParams) => meetupIndex(pIndex, params, mCount);

    if (!pIndexes[0].eq(0)) {
        let pIndex = participantIndex(registry, pIndexes[0].toNumber() - 1);
        return meetupIndexFn(pIndex, assignments.bootstrappersReputables)
    } else if (!pIndexes[1].eq(0)) {
        let pIndex = participantIndex(registry, pIndexes[1].toNumber() - 1 + assignmentCount.bootstrappers.toNumber());
        return meetupIndexFn(pIndex, assignments.bootstrappersReputables)
    } else if (!pIndexes[2].eq(0)) {
        let pIndex = participantIndex(registry, pIndexes[2].toNumber() - 1);
        return meetupIndexFn(pIndex, assignments.endorsees);
    } else if (!pIndexes[3].eq(0)) {
        let pIndex = participantIndex(registry, pIndexes[3].toNumber() - 1);
        return meetupIndexFn(pIndex, assignments.newbies);
    }

    return api.createType('MeetupIndexType', 0);
}

export async function getMeetupLocation(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, meetupIndex: MeetupIndexType): Promise<Location> {
    // ts-ignore can be removed once we autogenerate types and interfaces.
    // The problem is that the rpc methods don't contain a `communities` section by default.

    const [locations, assignmentParams] = await Promise.all([
        // @ts-ignore
        api.rpc.communities.getLocations(cid),
        getAssignment(api, cid, cIndex)
    ]);

    return meetupLocation(meetupIndex, locations, assignmentParams.locations).unwrap();
}

export async function getMeetupParticipants(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, meetupIndex: MeetupIndexType): Promise<Vec<AccountId>> {
    let registry = api.registry;
    const mIndexZeroBased = registry.createType('MeetupIndexType', meetupIndex.toNumber() - 1);

    const [meetupCount, assignmentParams, assignedCount] = await Promise.all([
        getMeetupCount(api, cid, cIndex),
        getAssignment(api, cid, cIndex),
        getAssignmentCount(api, cid, cIndex)
    ])

    const bootstrappers_reputables_promises: Promise<AccountId>[] = assignmentFnInverse(
        mIndexZeroBased,
        assignmentParams.bootstrappersReputables,
        meetupCount,
        participantIndex(api.registry, assignedCount.bootstrappers.add(assignedCount.reputables))
    )
        .filter((pIndex) => isBootstrapperOrReputable(pIndex, assignedCount))
        .map((pIndex) => bootstrapperOrReputableQuery(api, cid, cIndex, pIndex, assignedCount))

    const endorsees_promises: Promise<AccountId>[] = assignmentFnInverse(
        mIndexZeroBased,
        assignmentParams.endorsees,
        meetupCount,
        assignedCount.endorsees
    )
        .filter((pIndex) => pIndex.toNumber() < assignedCount.endorsees.toNumber())
        .map((pIndex) =>
            api.query.encointerCeremonies.endorseeRegistry<AccountId>(
                [cid, cIndex],
                participantIndex(api.registry, pIndex.toNumber() + 1)
            )
        );

    const newbie_promises: Promise<AccountId>[] = assignmentFnInverse(
        mIndexZeroBased,
        assignmentParams.newbies,
        meetupCount,
        assignedCount.newbies
    )
        .filter((pIndex) => pIndex.toNumber() < assignedCount.newbies.toNumber())
        .map((pIndex) =>
            api.query.encointerCeremonies.newbieRegistry<AccountId>(
                [cid, cIndex],
                participantIndex(api.registry, pIndex.toNumber() + 1)
            )
        );

    const participants = await Promise.all([
        ...bootstrappers_reputables_promises,
        ...endorsees_promises,
        ...newbie_promises
    ]);

    return api.createType('Vec<AccountId>', participants.map((a) => a.toHex()))
}

export async function getParticipantIndex(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<ParticipantIndexType> {

    const indexQuery = participantIndexQuery(api, cid, cIndex, address);

    // query everything in parallel to speed up process.
    const pIndexes = await Promise.all([
        indexQuery(IndexRegistry.Bootstrapper),
        indexQuery(IndexRegistry.Reputable),
        indexQuery(IndexRegistry.Endorsee),
        indexQuery(IndexRegistry.Newbie),
    ]);

    const index = pIndexes.find(i => i.toNumber() > 0);

    if (index !== undefined) {
        return index;
    } else {
        return participantIndex(api.registry, 0)
    }
}

export async function getNextMeetupTime(api: ApiPromise, location: Location): Promise<Moment> {
    const attestingStart = await getStartOfAttestingPhase(api);
    const oneDayT = api.createType<Moment>(
        'Moment',
        api.consts.encointerScheduler.momentsPerDay
    );

    return meetupTime(location, attestingStart, oneDayT)
}

export async function getStartOfAttestingPhase(api: ApiPromise): Promise<Moment> {
    const registry = api.registry;

    const [currentPhase, nextPhaseStart, attestingDuration, assigningDuration] = await Promise.all([
        api.query.encointerScheduler.currentPhase<CeremonyPhaseType>(),
        api.query.encointerScheduler.nextPhaseTimestamp<Moment>(),
        api.query.encointerScheduler.phaseDurations<Moment>('Attesting'),
        api.query.encointerScheduler.phaseDurations<Moment>('Assigning'),
    ])

    if (currentPhase.isAssigning) {
        return nextPhaseStart;
    } else if (currentPhase.isAttesting) {
        return registry.createType('Moment', nextPhaseStart.sub(attestingDuration))
    } else {
        // registering phase
        return registry.createType('Moment', nextPhaseStart.add(assigningDuration))
    }
}

/**
 * Returns either the community-specific demurrage or the default demurrage.
 */
export async function getDemurrage(api: ApiPromise, cid: CommunityIdentifier): Promise<Demurrage> {
    // See reasoning for `FixedI64F64` generic param: https://github.com/encointer/encointer-js/issues/47
    const demurrageCommunity = await api.query.encointerCommunities.demurragePerBlock<FixedI64F64>(cid)
        .then((dc) => api.createType('Demurrage', dc.bits))

    if (demurrageCommunity.eq(0)) {
        const demurrageDefault = (api.consts.encointerBalances.defaultDemurrage as FixedI64F64).bits;
        return api.createType('Demurrage', demurrageDefault);
    } else {
        return demurrageCommunity;
    }
}

/**
 * Returns either the community-specific ceremony income or the default ceremony income.
 */
export async function getCeremonyIncome(api: ApiPromise, cid: CommunityIdentifier): Promise<NominalIncomeType> {
    // See reasoning for `FixedI64F64` generic param: https://github.com/encointer/encointer-js/issues/47
    const [incomeCommunity, incomeDefault] = await Promise.all([
        api.query.encointerCommunities.nominalIncome<FixedI64F64>(cid).then((cr) => api.createType('NominalIncomeType', cr.bits)),
        api.query.encointerCeremonies.ceremonyReward<FixedI64F64>().then((cr) => api.createType('NominalIncomeType', cr.bits))
    ])

    if (incomeCommunity.eq(0)) {
        return incomeDefault
    } else {
        return incomeCommunity;
    }
}

function participantIndexQuery(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): IParticipantIndexQuery {
    return (storage_key: IndexRegistry) =>
        api.query.encointerCeremonies[storage_key]<ParticipantIndexType>([cid, cIndex], address)
}

function participantIndex(registry: Registry, ...params: unknown[]): ParticipantIndexType {
    return registry.createType('ParticipantIndexType', params)
}

function isBootstrapperOrReputable(pIndex: ParticipantIndexType, assigned: AssignmentCount): boolean {
    return pIndex.toNumber() < assigned.bootstrappers.toNumber() + assigned.reputables.toNumber();
}

function bootstrapperOrReputableQuery(
    api: ApiPromise,
    cid: CommunityIdentifier,
    cIndex: CeremonyIndexType,
    pIndex: ParticipantIndexType,
    assigned: AssignmentCount,
): Promise<AccountId> {
    if (pIndex < assigned.bootstrappers) {
        const i = participantIndex(api.registry, pIndex.toNumber() + 1);
        return api.query.encointerCeremonies.bootstrapperRegistry<AccountId>([cid, cIndex], i);
    } else {
        const i = participantIndex(api.registry, pIndex.toNumber() - assigned.bootstrappers.toNumber() + 1);
        return api.query.encointerCeremonies.reputableRegistry<AccountId>([cid, cIndex], i);
    }
}
