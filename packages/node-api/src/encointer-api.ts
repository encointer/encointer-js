import {ApiPromise} from "@polkadot/api";
import {
    Assignment,
    AssignmentCount, AssignmentParams,
    CeremonyIndexType,
    CommunityIdentifier, Location,
    MeetupIndexType, ParticipantIndexType,
} from "@encointer/types";
import {meetupIndex, meetupLocation, assignmentFnInverse} from "@encointer/util/assignment";
import {Vec} from "@polkadot/types";
import {AccountId} from "@polkadot/types/interfaces/runtime";
import {Registry} from "@polkadot/types/types";

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
    const index_query = (storage_key: IndexRegistry) => {
        return api.query.encointerCeremonies[storage_key]<ParticipantIndexType>([cid, cIndex], address)
    }

    // query everything in parallel to speed up process.
    const [mCount, assignments, ...pIndexes] = await Promise.all([
        getMeetupCount(api, cid, cIndex),
        getAssignment(api, cid, cIndex),
        index_query(IndexRegistry.Bootstrapper),
        index_query(IndexRegistry.Reputable),
        index_query(IndexRegistry.Endorsee),
        index_query(IndexRegistry.Newbie),
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
        let b = await getAssignmentCount(api, cid, cIndex);
        let pIndex = participantIndex(registry, pIndexes[1].toNumber() - 1 + b.bootstrappers.toNumber());
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
        .map((pIndex) => getBootstrapperOrReputable(api, cid, cIndex, pIndex, assignedCount))

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

    return api.createType('Vec<AccountId>', participants)
}

function participantIndex(registry: Registry, ...params: unknown[]): ParticipantIndexType {
    return registry.createType('ParticipantIndexType', params)
}

function isBootstrapperOrReputable(pIndex: ParticipantIndexType, assigned: AssignmentCount): boolean {
    return pIndex.toNumber() < assigned.bootstrappers.toNumber() + assigned.reputables.toNumber();
}

function getBootstrapperOrReputable(
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

enum IndexRegistry {
    Bootstrapper = "bootstrapperIndex",
    Reputable = "reputableIndex",
    Endorsee = "endorseeIndex",
    Newbie = "newbieIndex",
}
