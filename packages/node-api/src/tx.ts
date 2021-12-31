/**
 * Tx submit and watch wrappers.
 */

import {ApiPromise} from "@polkadot/api";
import {Keypair} from "@polkadot/util-crypto/types";
import {ISubmittableResult} from "@polkadot/types/types";
import {SubmittableExtrinsics} from "@polkadot/api/types";
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";

export interface ISendAndWatchTx<R extends ISubmittableResult> {
    sendAndWatchTx(signer: Keypair, xt: SubmittableExtrinsics<"promise">): R
}

/**
 * Send `tx` and watch until it is included in a block returning the execution result.
 *
 * @param api
 * @param signer
 * @param tx
 */
export function sendAndWatchTx<R extends ISubmittableResult>(api: ApiPromise, signer: Keypair, tx: SubmittableExtrinsic): Promise<any> {
    return new Promise((resolve => {
        let unsub = () => {
        };

        const onStatusChange = (result: R) => {
            if (result.status.isInBlock || result.status.isFinalized) {
                const {success, error} = _extractEvents(api, result);
                if (success) {
                    resolve({
                        hash: tx.hash.toString(),
                        time: new Date().getTime(),
                        params: tx.args
                    });
                }
                if (error) {
                    resolve({error});
                }
                unsub();
            } else {
                console.log('txStatusChange', result.status.type)
            }
        }
        tx.signAndSend(signer, {}, onStatusChange)
            .then((res) => {
                unsub = res;
            })
            .catch((err) => {
                console.log(`{error: ${err.message}}`);
            });
    }))
}

/**
 * Extract the events from a tx execution result.
 *
 * @param api
 * @param result
 */
function _extractEvents<R extends ISubmittableResult>(api: ApiPromise, result: R): IEventResult {
    if (!result || !result.events) {
        return;
    }

    let success = false;
    let error;
    result.events
        .filter((event) => !!event.event)
        .map(({event: {data, method, section}}) => {
            if (section === 'system' && method === 'ExtrinsicFailed') {
                if (result.dispatchError !== undefined) {
                    const dispatchError = result.dispatchError;
                    let message = dispatchError.type.toString();

                    if (dispatchError.isModule) {
                        try {
                            const mod = dispatchError.asModule;
                            const error = api.registry.findMetaError(
                                new Uint8Array([mod.index.toNumber(), mod.error.toNumber()])
                            );

                            message = `${error.section}.${error.name}`;
                        } catch (error) {
                            // swallow error
                        }
                    }
                    console.log('txUpdateEvent', {
                        title: `${section}.${method}`,
                        message
                    });
                    error = message;
                }

            } else {
                console.log('txUpdateEvent', {
                    title: `${section}.${method}`,
                    message: 'ok'
                });
                if (section == 'system' && method == 'ExtrinsicSuccess') {
                    success = true;
                }
            }
        });
    return {success, error};
}

interface IEventResult {
    success: boolean,
    error: string | undefined
}
