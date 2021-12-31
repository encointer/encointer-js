import {Keypair} from "@polkadot/util-crypto/types";
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";
import {ISubmittableResult} from "@polkadot/types/types";

export interface ISubmitAndWatchTx {
    sendAndWatchTx(signer: Keypair, xt: SubmittableExtrinsic): ISubmittableResult
}

export interface IExtractEventResult {
    success: boolean,
    error: string | undefined
}
