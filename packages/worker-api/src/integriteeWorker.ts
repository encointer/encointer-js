import type {u32} from '@polkadot/types';

import type {KeyringPair} from '@polkadot/keyring/types';
import type {Balance, Hash} from '@polkadot/types/interfaces/runtime';
import type {
    ShardIdentifier, IntegriteeTrustedCallSigned,
} from '@encointer/types';

import {type CallOptions, Request} from './interface.js';
import {callGetter, sendTrustedCall} from './sendRequest.js';
import {createTrustedCall, signTrustedCall} from "./requests.js";
import {PubKeyPinPair, toAccount} from "@encointer/util/common";
import {Worker} from "./worker.js";
import bs58 from "bs58";
import type {Signer} from "@polkadot/types/types";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";

export class IntegriteeWorker extends Worker {

    public async getNonce(accountOrPubKey: KeyringPair | PubKeyPinPair, shard: string, options: CallOptions = {} as CallOptions): Promise<u32> {
        return await callGetter<u32>(this, [Request.TrustedGetter, 'nonce', 'u32'], {
            shard: shard,
            account: toAccount(accountOrPubKey, this.keyring())
        }, options)
    }

    public async getBalance(accountOrPubKey: KeyringPair | PubKeyPinPair, shard: string, options: CallOptions = {} as CallOptions): Promise<Balance> {
        return await callGetter<Balance>(this, [Request.TrustedGetter, 'free_balance', 'Balance'], {
            shard: shard,
            account: toAccount(accountOrPubKey, this.keyring())
        }, options)
    }

    public async trustedBalanceTransfer(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        from: String,
        to: String,
        amount: number,
        options: CallOptions = {} as CallOptions,
        signer?: Signer
    ): Promise<Hash> {
        const nonce = await this.getNonce(account, shard, options);
        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('BalanceTransferArgs', [from, to, amount])
        const call = createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signer);
        return this.sendTrustedCall(signed, shardT, options);
    }

    public async balanceUnshieldFunds(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        options: CallOptions = {} as CallOptions,
        signer?: Signer
    ): Promise<Hash> {
        const nonce = await this.getNonce(account, shard, options);
        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('BalanceUnshieldArgs', [fromIncognitoAddress, toPublicAddress, amount, shardT])
        const call = createTrustedCall(this, ['balance_unshield', 'BalanceUnshieldArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signer);
        return this.sendTrustedCall(signed, shardT, options);
    }

    async sendTrustedCall(call: IntegriteeTrustedCallSigned, shard: ShardIdentifier, options: CallOptions = {} as CallOptions): Promise<Hash> {
        if (this.shieldingKey() == undefined) {
            console.log(`[sentTrustedCall] Setting the shielding pubKey of the worker.`)
            await this.getShieldingKey(options);
        }

        return sendTrustedCall<Hash>(this, call, shard, true, 'TrustedOperationResult', options);
    }
}
