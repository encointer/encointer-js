import type {AnyTuple} from "@polkadot/types/types";
import type {CodecHash} from "@polkadot/types/interfaces/runtime";
import type {ParticipantIndexType} from "@encointer/types";

export interface IExtractEventResult {
    success: boolean,
    error: string | undefined
}

export interface ISubmitAndWatchResult {
    hash: CodecHash,
    time: number,
    params: AnyTuple
    error?: string
}

export interface IParticipantIndexQuery {
    (registry: IndexRegistry): Promise<ParticipantIndexType>
}

export enum IndexRegistry {
    Bootstrapper = "bootstrapperIndex",
    Reputable = "reputableIndex",
    Endorsee = "endorseeIndex",
    Newbie = "newbieIndex",
}
