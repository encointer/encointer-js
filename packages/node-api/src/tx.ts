/**
 * Tx submit and watch wrappers.
 */

import {ApiPromise} from "@polkadot/api";
import {ISubmittableResult} from "@polkadot/types/types";
import {SubmittableExtrinsic} from "@polkadot/api/promise/types";
import {KeyringPair} from "@polkadot/keyring/types";
import {IExtractEventResult, ISubmitAndWatchResult} from "@encointer/node-api/interface";

/**
 * Send `tx` and watch until it is included in a block returning the execution result.
 *
 * @param api
 * @param signer
 * @param tx
 */
export function submitAndWatchTx(api: ApiPromise, signer: KeyringPair, tx: SubmittableExtrinsic): Promise<ISubmitAndWatchResult> {
    return new Promise((resolve => {
        let unsub = () => {
        };

        const onStatusChange = (result: ISubmittableResult) => {
            if (result.status.isInBlock || result.status.isFinalized) {
                const {success, error} = extractEvents(api, result);

                if (success) {
                    resolve({
                        hash: tx.hash,
                        time: new Date().getTime(),
                        params: tx.args
                    });
                }
                if (error) {
                    resolve({
                        hash: tx.hash,
                        time: new Date().getTime(),
                        params: tx.args,
                        error: error
                    });
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
function extractEvents(api: ApiPromise, result: ISubmittableResult): IExtractEventResult {
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
