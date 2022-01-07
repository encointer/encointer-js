import {AnyTuple} from "@polkadot/types/types";
import {CodecHash} from "@polkadot/types/interfaces/runtime";

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
