import type {u32} from '@polkadot/types';

import type {Balance, Hash} from '@polkadot/types/interfaces/runtime';
import type {
    ShardIdentifier, IntegriteeTrustedCallSigned, IntegriteeGetter,
} from '@encointer/types';
import {
    type RequestOptions,
    type ISubmittableGetter,
    Request,
    type JsonRpcRequest, type TrustedGetterArgs, type TrustedSignerOptions,
} from './interface.js';
import {Worker} from "./worker.js";
import {callGetter, sendTrustedCall, sendWorkerRequest} from './sendRequest.js';
import {
    createGetterRpc,
    createSignedGetter,
    createTrustedCall,
    signTrustedCall,
} from "./requests.js";
import bs58 from "bs58";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";

export class IntegriteeWorker extends Worker {

    public async getNonce(accountOrPubKey: AddressOrPair, shard: string, singerOptions?: TrustedSignerOptions, requestOptions?: RequestOptions): Promise<u32> {
        return await callGetter<u32>(this, [Request.TrustedGetter, 'nonce', 'u32'], {
            shard: shard,
            account: accountOrPubKey,
            signer: singerOptions?.signer
        }, requestOptions)
    }

    public async getNonceGetter(accountOrPubKey: AddressOrPair, shard: string, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, Balance>> {
        const trustedGetterArgs = {
            shard: shard,
            account: accountOrPubKey,
            signer: signerOptions?.signer,
        }
        return await submittableGetter<IntegriteeWorker, Balance>(this, 'nonce', trustedGetterArgs,'u32');
    }

    public async getBalance(accountOrPubKey: AddressOrPair, shard: string, signerOptions?: TrustedSignerOptions, requestOptions?: RequestOptions): Promise<Balance> {
        return await callGetter<Balance>(this, [Request.TrustedGetter, 'free_balance', 'Balance'], {
            shard: shard,
            account: accountOrPubKey,
            signer: signerOptions?.signer
        }, requestOptions)
    }

    public async getBalanceGetter(accountOrPubKey: AddressOrPair, shard: string, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, Balance>> {
        const trustedGetterArgs = {
            shard: shard,
            account: accountOrPubKey,
            signer: signerOptions?.signer
        }
        return await submittableGetter<IntegriteeWorker, Balance>(this, 'free_balance', trustedGetterArgs,'Balance');
    }

    public async trustedBalanceTransfer(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        from: String,
        to: String,
        amount: number,
        signerOptions?: TrustedSignerOptions,
        requestOptions?: RequestOptions,
    ): Promise<Hash> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions, requestOptions);
        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('BalanceTransferArgs', [from, to, amount])
        const call = createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT, requestOptions);
    }

    public async balanceUnshieldFunds(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        signerOptions?: TrustedSignerOptions,
        requestOptions?: RequestOptions,
    ): Promise<Hash> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions, requestOptions);
        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('BalanceUnshieldArgs', [fromIncognitoAddress, toPublicAddress, amount, shardT])
        const call = createTrustedCall(this, ['balance_unshield', 'BalanceUnshieldArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT, requestOptions);
    }

    async sendTrustedCall(call: IntegriteeTrustedCallSigned, shard: ShardIdentifier, requestOptions?: RequestOptions): Promise<Hash> {
        if (this.shieldingKey() == undefined) {
            console.log(`[sentTrustedCall] Setting the shielding pubKey of the worker.`)
            await this.getShieldingKey(requestOptions);
        }

        return sendTrustedCall<Hash>(this, call, shard, true, 'TrustedOperationResult', requestOptions);
    }
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

    into_rpc(): JsonRpcRequest {
        return createGetterRpc(this.worker, this.getter, this.shard);
    }

    send(requestOptions?: RequestOptions): Promise<Type> {
        const rpc = this.into_rpc();
        return sendWorkerRequest(this.worker, rpc, this.returnType, requestOptions);
    }
}

export const submittableGetter = async <W extends Worker, T>(self: W, request: string, args: TrustedGetterArgs, returnType: string)=> {
    const {shard, account} = args;
    const shardT = self.createType('ShardIdentifier', bs58.decode(shard));
    const signedGetter = await createSignedGetter(self, request, account, { signer: args?.signer })
    return new SubmittableGetter<W, T>(self, shardT, signedGetter, returnType);
}
