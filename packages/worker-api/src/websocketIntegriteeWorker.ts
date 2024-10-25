import type {Hash} from '@polkadot/types/interfaces/runtime';
import type {
    ShardIdentifier,
    IntegriteeTrustedCallSigned, IntegriteeGetter,
} from '@encointer/types';
import {
    type ISubmittableGetter, type JsonRpcRequest,
    type TrustedGetterArgs, type TrustedGetterParams,
    type TrustedSignerOptions,
} from './interface.js';
import {Worker} from "./worker.js";
import {
    createSignedGetter,
    createTrustedCall,
    signTrustedCall,
} from "./requests.js";
import bs58 from "bs58";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import type {u32} from "@polkadot/types-codec";
import type {AccountInfo} from "@polkadot/types/interfaces/system";
import {asString} from "@encointer/util";

export class IntegriteeWorker extends Worker {

    public async getNonce(accountOrPubKey: AddressOrPair, shard: string, singerOptions?: TrustedSignerOptions): Promise<u32> {
        const info = await this.getAccountInfo(accountOrPubKey, shard, singerOptions);
        return info.nonce;
    }

    public async getAccountInfo(accountOrPubKey: AddressOrPair, shard: string, singerOptions?: TrustedSignerOptions): Promise<AccountInfo> {
        const getter = await this.accountInfoGetter(accountOrPubKey, shard, singerOptions);
        return getter.send();
    }

    public async accountInfoGetter(accountOrPubKey: AddressOrPair, shard: string, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, AccountInfo>> {
        const trustedGetterArgs = {
            shard: shard,
            account: accountOrPubKey,
            signer: signerOptions?.signer,
        }
        return await submittableTrustedGetter<IntegriteeWorker, AccountInfo>(this, 'account_info', accountOrPubKey, trustedGetterArgs, asString(accountOrPubKey), 'AccountInfo');
    }


    public async balanceUnshieldFunds(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<Hash> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)

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

        const returnValue = await this.subscribe('author_submitAndWatchExtrinsic', [r.toHex()])

        // const returnValue = await this.send('author_submitExtrinsic', [r.toHex()])

        console.debug(`[sendTrustedCall] result: ${JSON.stringify(returnValue)}`);

        return this.createType('Hash', returnValue.value);
    }
}

async function submittableTrustedGetter <W extends Worker, T>(self: W, request: string, account: AddressOrPair, args: TrustedGetterArgs, trustedGetterParams: TrustedGetterParams, returnType: string): Promise<SubmittableGetter<W, T>> {
    const {shard} = args;
    const shardT = self.createType('ShardIdentifier', bs58.decode(shard));
    const signedGetter = await createSignedGetter(self, request, account, trustedGetterParams, { signer: args?.signer })
    return new SubmittableGetter<W, T>(self, shardT, signedGetter, returnType);
}


export class SubmittableGetter<W extends Worker, Type> implements ISubmittableGetter<W, Type> {
    worker: W;
    shard: ShardIdentifier;
    getter: IntegriteeGetter;
    returnType: string;

    constructor(worker: W, shard: ShardIdentifier, getter: IntegriteeGetter, returnType: string) {
        this.worker = worker;
        this.shard = shard;
        this.getter = getter;
        this.returnType = returnType;
    }

    // todo: deprecated
    // @ts-ignore
    into_rpc(): JsonRpcRequest {
        // return createGetterRpc(this.worker, this.getter, this.shard);
    }

    async send(): Promise<Type> {
        return this.worker.sendGetter(this.getter, this.shard, this.returnType);
    }
}
