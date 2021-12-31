import {Keypair} from "@polkadot/util-crypto/types";
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";
import {AnyTuple, ISubmittableResult} from "@polkadot/types/types";
import {CodecHash} from "@polkadot/types/interfaces/runtime";

export interface ISubmitAndWatchTx {
    sendAndWatchTx(signer: Keypair, xt: SubmittableExtrinsic): ISubmittableResult
}

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
