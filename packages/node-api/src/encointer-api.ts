import {ApiPromise} from "@polkadot/api";
import {ApiOptions} from "@polkadot/api/types";
import {
    Assignment,
    AssignmentCount, AssignmentParams,
    CeremonyIndexType,
    CommunityIdentifier,
    MeetupIndexType, ParticipantIndexType,
} from "@encointer/types";
import {meetup_index} from "@encointer/util/assignment";

export class EncointerApi extends ApiPromise {

    constructor(options?: ApiOptions) {
        super(options);
    }

    async getAssignment(cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<Assignment> {
        return this.query.encointerCeremonies.assignments<Assignment>([cid, cIndex], address);
    }

    async getAssignmentCount(cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<AssignmentCount> {
        return this.query.encointerCeremonies.assignmentCounts<AssignmentCount>([cid, cIndex], address);
    }

    async getMeetupCount(cid: CommunityIdentifier, cIndex: CeremonyIndexType): Promise<MeetupIndexType> {
        return this.query.encointerCeremonies.MeetupCount<MeetupIndexType>([cid, cIndex]);
    }


    async getMeetupIndex(cid: CommunityIdentifier, cIndex: CeremonyIndexType, address: String): Promise<MeetupIndexType> {
        const mCount = await this.getMeetupCount(cid, cIndex);

        if (mCount.eq(0)) {
            // 0 index means not registered
            return mCount;
        }

        const assignments = await this.getAssignment(cid, cIndex, address);

        // helper query to make below code more readable
        const index_query = (storage_key: IndexRegistry) => {
            return this.query.encointerCeremonies[storage_key]<ParticipantIndexType>([cid, cIndex], address)
        }

        const meetupIndexFn =
            (pIndex: ParticipantIndexType, params: AssignmentParams) => meetup_index(pIndex, params, mCount);

        let pIndexes = await Promise.all([
            index_query(IndexRegistry.Bootstrapper),
            index_query(IndexRegistry.Reputable),
            index_query(IndexRegistry.Endorsee),
            index_query(IndexRegistry.Newbie),
        ]);

        if (!pIndexes[0].eq(0)) {
            let pIndex = this.createType('ParticipantIndexType', pIndexes[0].toNumber() - 1);
            return meetupIndexFn(pIndex, assignments.bootstrappers_reputables)
        } else if (!pIndexes[1].eq(0)) {
            let b = await this.getAssignmentCount(cid, cIndex, address);
            let pIndex = this.createType('ParticipantIndexType', pIndexes[1].toNumber() - 1 + b.bootstrappers.toNumber());
            return meetupIndexFn(pIndex, assignments.bootstrappers_reputables)
        } else if (!pIndexes[2].eq(0)) {
            let pIndex = this.createType('ParticipantIndexType', pIndexes[2].toNumber() - 1);
            return meetupIndexFn(pIndex, assignments.endorsees);
        } else if (!pIndexes[3].eq(0)) {
            let pIndex = this.createType('ParticipantIndexType', pIndexes[3].toNumber() - 1);
            return meetupIndexFn(pIndex, assignments.newbies);
        }

        return this.createType('MeetupIndexType', 0);
    }
}

enum IndexRegistry {
    Bootstrapper = "BootstrapperIndex",
    Reputable = "ReputableIndex",
    Endorsee = "EndorseeIndex",
    Newbie = "NewbieIndex",
}
