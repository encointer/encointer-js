import type {Hash} from '@polkadot/types/interfaces/runtime';
import type {
    ShardIdentifier,
    IntegriteeTrustedCallSigned,
} from '@encointer/types';
import {
    type TrustedSignerOptions,
} from './interface.js';
import {Worker} from "./websocketWorker.js";
import {
    createTrustedCall,
    signTrustedCall,
} from "./requests.js";
import bs58 from "bs58";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";

export class IntegriteeWorker extends Worker {

    public async balanceUnshieldFunds(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<Hash> {
        // const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions, requestOptions)
        const nonce = signerOptions?.nonce ?? this.createType('u32', 0);

        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('BalanceUnshieldArgs', [fromIncognitoAddress, toPublicAddress, amount, shardT])
        const call = createTrustedCall(this, ['balance_unshield', 'BalanceUnshieldArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    async sendTrustedCall(call: IntegriteeTrustedCallSigned, shard: ShardIdentifier): Promise<Hash> {
        if (this.shieldingKey() == undefined) {
            console.debug(`[sentTrustedCall] Setting the shielding pubKey of the worker.`)
            await this.getShieldingKey();
        }

        return this.submitAndWatch(call, shard, true);
    }

    async submitAndWatch(call: IntegriteeTrustedCallSigned, shard: ShardIdentifier, direct: boolean): Promise<Hash> {
        let top;
        if (direct) {
            top = this.createType('IntegriteeTrustedOperation', {
                direct_call: call
            })
        } else {
            top = this.createType('IntegriteeTrustedOperation', {
                indirect_call: call
            })
        }

        console.debug(`Sending TrustedOperation: ${JSON.stringify(top)}`);

        const cyphertext = await this.encrypt(top.toU8a());

        const r = this.createType(
            'Request', { shard, cyphertext: cyphertext }
        );

        const hash = await this.subscribe('author_submitAndWatchExtrinsic', [r.toHex()])

        console.debug(`[sendTrustedCall] sent result: ${JSON.stringify(r)}`);

        return hash.hash;
    }
}
