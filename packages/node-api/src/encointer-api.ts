import {ApiPromise} from "@polkadot/api";
import type {
    Assignment,
    AssignmentCount,
    CeremonyIndexType, CeremonyPhaseType,
    CommunityIdentifier, Demurrage, FixedI64F64, Location,
    MeetupIndexType, MeetupTimeOffsetType, NominalIncomeType, ParticipantIndexType, ParticipantRegistration,
} from "@encointer/types";
import {
    meetupLocation,
    assignmentFnInverse,
    meetupTime,
    computeMeetupIndex,
    getRegistration,
    computeStartOfAttestingPhase
} from "@encointer/util/assignment";
import {Vec} from "@polkadot/types";
import type {AccountId, Moment} from "@polkadot/types/interfaces/runtime";
import type {Registry} from "@polkadot/types/types";
import {IndexRegistry} from "@encointer/node-api/interface";
import type {IParticipantIndexQuery} from "@encointer/node-api/interface";
import {Option} from "@polkadot/types-codec";

export async function getAssignment(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<Assignment> {
    return api.query["encointerCeremonies"]["assignments"]<Assignment>([cid, cIndex]);
}

export async function getAssignmentCount(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<AssignmentCount> {
    return api.query["encointerCeremonies"]["assignmentCounts"]<AssignmentCount>([cid, cIndex]);
}

export async function getMeetupCount(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<MeetupIndexType> {
    return api.query["encointerCeremonies"]["meetupCount"]<MeetupIndexType>([cid, cIndex]);
}

export async function getMeetupTimeOffset(api: ApiPromise): Promise<MeetupTimeOffsetType> {
    console.log('HUHU1337')
    return api.query["encointerCeremonies"]["meetupTimeOffset"]<MeetupTimeOffsetType>();
}

export async function getParticipantRegistration(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<Option<ParticipantRegistration>> {
    // helper query to make below code more readable
    const indexQuery = participantIndexQuery(api, cid, cIndex, address);

    const pIndexes = await Promise.all([
        indexQuery(IndexRegistry.Bootstrapper),
        indexQuery(IndexRegistry.Reputable),
        indexQuery(IndexRegistry.Endorsee),
        indexQuery(IndexRegistry.Newbie),
    ]);

    return getRegistration(pIndexes);
}

export async function getMeetupIndex(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<MeetupIndexType> {

    // query everything in parallel to speed up process.
    const [mCount, assignments, assignmentCount, registration] = await Promise.all([
        getMeetupCount(api, cid, cIndex),
        getAssignment(api, cid, cIndex),
        getAssignmentCount(api, cid, cIndex),
        getParticipantRegistration(api, cid, cIndex,address),
    ]);

    console.log(`[getMeetupIndex] mCount: ${mCount}`)
    console.log(`[getMeetupIndex] assignment: ${JSON.stringify(assignments)}`)
    console.log(`[getMeetupIndex] assignmentCount: ${JSON.stringify(assignmentCount)}`)
    console.log(`[getMeetupIndex] registration: ${JSON.stringify(registration)}`)


    if (mCount.eq(0)) {
        // 0 index means not registered
        return mCount;
    }

    if (registration.isNone) {
        console.log("[getMeetupIndex] participantIndex was 0");
        return mCount.registry.createTypeUnsafe("MeetupIndexType", [0]) as MeetupIndexType; // don't know why the cast is necessary
    }

    return computeMeetupIndex(registration.unwrap(), assignments, assignmentCount, mCount);
}

export async function getMeetupLocation(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, meetupIndex: MeetupIndexType): Promise<Location> {
    // ts-ignore can be removed once we autogenerate types and interfaces.
    // The problem is that the rpc methods don't contain a `communities` section by default.

    const [locations, assignmentParams] = await Promise.all([
        // @ts-ignore
        api.rpc.encointer.getLocations(cid),
        getAssignment(api, cid, cIndex)
    ]);

    return meetupLocation(meetupIndex, locations, assignmentParams.locations).unwrap();
}

export async function getMeetupParticipants(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, meetupIndex: MeetupIndexType): Promise<Vec<AccountId>> {
    let registry = api.registry;
    const mIndexZeroBased = registry.createType<MeetupIndexType>('MeetupIndexType', meetupIndex.toNumber() - 1);

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
            api.query["encointerCeremonies"]["endorseeRegistry"]<AccountId>(
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
            api.query["encointerCeremonies"]["newbieRegistry"]<AccountId>(
                [cid, cIndex],
                participantIndex(api.registry, pIndex.toNumber() + 1)
            )
        );

    const participants = await Promise.all([
        ...bootstrappers_reputables_promises,
        ...endorsees_promises,
        ...newbie_promises
    ]);

    return registry.createTypeUnsafe<Vec<AccountId>>('Vec<AccountId>', [participants.map((a) => a.toHex())]);
    //api.createType('Vec<AccountId>', participants.map((a) => a.toHex()))
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
    const [attestingStart, offset] = await Promise.all([
        getStartOfAttestingPhase(api),
        getMeetupTimeOffset(api),
    ]);

    const oneDayT = api.createType<Moment>(
        'Moment',
        api.consts["encointerScheduler"]["momentsPerDay"]
    );

    _log(`getNextMeetupTime: attestingStart: ${attestingStart}`);
    _log(`getNextMeetupTime: meetupTimeOffset: ${offset}`);
    _log(`getNextMeetupTime: momentPerDay: ${oneDayT}`);

    return meetupTime(location, attestingStart, oneDayT, offset)
}

export async function getStartOfAttestingPhase(api: ApiPromise): Promise<Moment> {
    const [currentPhase, nextPhaseStart, assigningDuration, attestingDuration] = await Promise.all([
        api.query["encointerScheduler"]["currentPhase"]<CeremonyPhaseType>(),
        api.query["encointerScheduler"]["nextPhaseTimestamp"]<Moment>(),
        api.query["encointerScheduler"]["phaseDurations"]<Moment>('Assigning'),
        api.query["encointerScheduler"]["phaseDurations"]<Moment>('Attesting'),
    ])

    return computeStartOfAttestingPhase(currentPhase, nextPhaseStart, assigningDuration, attestingDuration)
}

/**
 * Returns either the community-specific demurrage or the default demurrage.
 */
export async function getDemurrage(api: ApiPromise, cid: CommunityIdentifier): Promise<Demurrage> {
    // See reasoning for `FixedI64F64` generic param: https://github.com/encointer/encointer-js/issues/47
    const demurrageCommunity = await api.query["encointerBalances"]["demurragePerBlock"]<FixedI64F64>(cid)
        .then((dc) => api.createType<Demurrage>('Demurrage', dc.bits))

    if (demurrageCommunity.eq(0)) {
        const demurrageDefault = (api.consts["encointerBalances"]["defaultDemurrage"] as FixedI64F64).bits;
        return api.createType<Demurrage>('Demurrage', demurrageDefault);
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
        api.query["encointerCommunities"]["nominalIncome"]<FixedI64F64>(cid).then((cr) => api.createType<NominalIncomeType>('NominalIncomeType', cr.bits)),
        api.query["encointerCeremonies"]["ceremonyReward"]<FixedI64F64>().then((cr) => api.createType<NominalIncomeType>('NominalIncomeType', cr.bits))
    ])

    if (incomeCommunity.eq(0)) {
        return incomeDefault
    } else {
        return incomeCommunity;
    }
}

function participantIndexQuery(api: ApiPromise, cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): IParticipantIndexQuery {
    return (storage_key: IndexRegistry) =>
        api.query["encointerCeremonies"][storage_key]<ParticipantIndexType>([cid, cIndex], address)
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
        return api.query["encointerCeremonies"]["bootstrapperRegistry"]<AccountId>([cid, cIndex], i);
    } else {
        const i = participantIndex(api.registry, pIndex.toNumber() - assigned.bootstrappers.toNumber() + 1);
        return api.query["encointerCeremonies"]["reputableRegistry"]<AccountId>([cid, cIndex], i);
    }
}

function _log(msg: String) {
    console.log(`[encointer-js:api] ${msg}`)
}
