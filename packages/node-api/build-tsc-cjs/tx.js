"use strict";
/**
 * Tx submit and watch wrappers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractEvents = exports.submitAndWatchTx = void 0;
/**
 * Send `tx` and watch until it is included in a block returning the execution result.
 *
 * @param api
 * @param signer
 * @param tx
 */
function submitAndWatchTx(api, signer, tx) {
    return new Promise((resolve => {
        let unsub = () => {
        };
        const onStatusChange = (result) => {
            if (result.status.isInBlock || result.status.isFinalized) {
                const { success, error } = extractEvents(api, result);
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
            }
            else {
                console.log('txStatusChange', result.status.type);
            }
        };
        tx.signAndSend(signer, {}, onStatusChange)
            .then((res) => {
            unsub = res;
        })
            .catch((err) => {
            console.log(`{error: ${err.message}}`);
        });
    }));
}
exports.submitAndWatchTx = submitAndWatchTx;
/**
 * Extract the events from a tx execution result.
 *
 * @param api
 * @param result
 */
function extractEvents(api, result) {
    let success = false;
    let error;
    result.events
        .filter((event) => !!event.event)
        .map(({ event: { data, method, section } }) => {
        if (section === 'system' && method === 'ExtrinsicFailed') {
            if (result.dispatchError !== undefined) {
                const dispatchError = result.dispatchError;
                let message = dispatchError.type.toString();
                if (dispatchError.isModule) {
                    try {
                        const mod = dispatchError.asModule;
                        const error = api.registry.findMetaError(new Uint8Array([mod.index.toNumber(), mod.error[0]]));
                        message = `${error.section}.${error.name}`;
                    }
                    catch (error) {
                        message = `could not extract dispatch error: ${JSON.stringify(error)}`;
                    }
                }
                console.log('txUpdateEvent', `${JSON.stringify({
                    title: `${section}.${method}`,
                    message
                })}`);
                error = message;
            }
        }
        else {
            console.log('txUpdateEvent', `${JSON.stringify({
                title: `${section}.${method}`,
                message: data
            })}`);
            if (section == 'system' && method == 'ExtrinsicSuccess') {
                success = true;
            }
        }
    });
    return { success, error };
}
exports.extractEvents = extractEvents;
