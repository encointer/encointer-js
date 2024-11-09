import type {
    ShardIdentifier,
    IntegriteeTrustedCallSigned,
    IntegriteeGetter,
    GuessTheNumberInfo,
    GuessTheNumberTrustedCall,
    GuessTheNumberPublicGetter,
    GuessTheNumberTrustedGetter,
    AttemptsArg,
    ParentchainsInfo,
    TrustedNote, NotesBucketInfo,
} from '@encointer/types';
import {
    type ISubmittableGetter,
    type TrustedGetterArgs,
    type TrustedSignerOptions,
    type PublicGetterArgs,
    type PublicGetterParams, type TrustedGetterParams, type TrustedCallResult,
} from './interface.js';
import {Worker} from "./worker.js";
import {
    createIntegriteeGetterPublic,
    createSignedGetter,
    createTrustedCall,
    signTrustedCall, type TrustedCallArgs, type TrustedCallVariant,
} from "./requests.js";
import bs58 from "bs58";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import type { AccountInfo } from "@polkadot/types/interfaces/system";
import type {u32} from "@polkadot/types-codec";
import {asString} from "@encointer/util";
import {Vec} from "@polkadot/types";

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

    public parentchainsInfoGetter(shard: string): SubmittableGetter<IntegriteeWorker, ParentchainsInfo> {
        const publicGetterArgs = {
            shard: shard,
        }
        return submittablePublicGetter<IntegriteeWorker, ParentchainsInfo>(this, 'parentchains_info', publicGetterArgs, null, 'ParentchainsInfo');
    }

    public noteBucketsInfoGetter(shard: string): SubmittableGetter<IntegriteeWorker, NotesBucketInfo> {
        const publicGetterArgs = {
            shard: shard,
        }
        return submittablePublicGetter<IntegriteeWorker, NotesBucketInfo>(this, 'note_buckets_info', publicGetterArgs, null, 'NotesBucketInfo');
    }


    public async notesForTrustedGetter(accountOrPubKey: AddressOrPair, bucketIndex: number, shard: string, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, Vec<TrustedNote>>> {
        const trustedGetterArgs = {
            shard: shard,
            account: accountOrPubKey,
            signer: signerOptions?.signer,
        }
        const notesForArgs = this.createType('NotesForArgs', [asString(accountOrPubKey), bucketIndex]);
        return await submittableTrustedGetter<IntegriteeWorker, Vec<TrustedNote>>(this, 'notes_for', accountOrPubKey, trustedGetterArgs, notesForArgs,'Vec<TrustedNote>');
    }

    public guessTheNumberInfoGetter(shard: string): SubmittableGetter<IntegriteeWorker, GuessTheNumberInfo> {
        const publicGetterArgs = {
            shard: shard,
        }
        const getterParams = guessTheNumberPublicGetter(this, 'guess_the_number_info');
        return submittablePublicGetter<IntegriteeWorker, GuessTheNumberInfo>(this, 'guess_the_number', publicGetterArgs, getterParams, 'GuessTheNumberInfo');
    }

    public async guessTheNumberAttemptsTrustedGetter(accountOrPubKey: AddressOrPair, shard: string, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, AccountInfo>> {
        const trustedGetterArgs = {
            shard: shard,
            account: accountOrPubKey,
            signer: signerOptions?.signer,
        }
        const args = this.createType('AttemptsArg', {origin:  asString(accountOrPubKey)});
        const getterParams = guessTheNumberTrustedGetter(this, 'attempts', args);
        return await submittableTrustedGetter<IntegriteeWorker, AccountInfo>(this, 'guess_the_number', accountOrPubKey, trustedGetterArgs, getterParams,'u8');
    }

    public async trustedBalanceTransfer(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        from: String,
        to: String,
        amount: number,
        note?: string,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));

        let call;
        if (note == null) {
            const params = this.createType('BalanceTransferArgs', [from, to, amount])
            call = createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], params);
        } else {
            const params = this.createType('BalanceTransferWithNoteArgs', [from, to, amount, note])
            call = createTrustedCall(this, ['balance_transfer_with_note', 'BalanceTransferWithNoteArgs'], params);
        }

        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async balanceUnshieldFunds(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)

        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('BalanceUnshieldArgs', [fromIncognitoAddress, toPublicAddress, amount, shardT])
        const call = createTrustedCall(this, ['balance_unshield', 'BalanceUnshieldArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async guessTheNumber(
        account: AddressOrPair,
        shard: string,
        mrenclave: string,
        guess: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)

        const shardT = this.createType('ShardIdentifier', bs58.decode(shard));
        const params = this.createType('GuessArgs', [asString(account), guess])
        const guessThNumberCall = guessTheNumberCall(this, ['guess', 'GuessArgs'], params);
        const call = createTrustedCall(this, ['guess_the_number', 'GuessTheNumberTrustedCall'], guessThNumberCall);
        const signed = await signTrustedCall(this, call, account, shardT, mrenclave, nonce, signerOptions);

        console.debug(`GuessTheNumber ${JSON.stringify(signed)}`);
        return this.sendTrustedCall(signed, shardT);
    }

    async sendTrustedCall(call: IntegriteeTrustedCallSigned, shard: ShardIdentifier): Promise<TrustedCallResult> {
        if (this.shieldingKey() == undefined) {
            console.debug(`[sentTrustedCall] Setting the shielding pubKey of the worker.`)
            await this.getShieldingKey();
        }

        const top = this.createType('IntegriteeTrustedOperation', {
            direct_call: call
        })

        return this.submitAndWatchTop(top, shard);
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

    async send(): Promise<Type> {
        return this.worker.sendGetter(this.getter, this.shard, this.returnType);
    }
}

async function submittableTrustedGetter<W extends Worker, T>(self: W, request: string, account: AddressOrPair, args: TrustedGetterArgs, trustedGetterParams: TrustedGetterParams, returnType: string): Promise<SubmittableGetter<W, T>> {
    const {shard} = args;
    const shardT = self.createType('ShardIdentifier', bs58.decode(shard));
    const signedGetter = await createSignedGetter(self, request, account, trustedGetterParams, { signer: args?.signer })
    return new SubmittableGetter<W, T>(self, shardT, signedGetter, returnType);
}


function submittablePublicGetter<W extends Worker, T>(self: W, request: string, args: PublicGetterArgs, publicGetterParams: PublicGetterParams, returnType: string): SubmittableGetter<W, T> {
    const {shard} = args;
    const shardT = self.createType('ShardIdentifier', bs58.decode(shard));
    const signedGetter = createIntegriteeGetterPublic(self, request, publicGetterParams)
    return new SubmittableGetter<W, T>(self, shardT, signedGetter, returnType);
}

function guessTheNumberPublicGetter(
    self: Worker,
    getterVariant: string,
): GuessTheNumberPublicGetter {
    return self.createType('GuessTheNumberPublicGetter', {
        [getterVariant]: null
    });
}

function guessTheNumberTrustedGetter(
    self: Worker,
    getterVariant: string,
    params: GuessTheNumberTrustedGetterParams
): GuessTheNumberTrustedGetter {
    return self.createType('GuessTheNumberTrustedGetter', {
        [getterVariant]: params
    });
}

export type GuessTheNumberTrustedGetterParams = AttemptsArg | null;


function guessTheNumberCall(
    self: Worker,
    callVariant: TrustedCallVariant,
    params: TrustedCallArgs
): GuessTheNumberTrustedCall {
    const [variant, argType] = callVariant;

    return self.createType('GuessTheNumberTrustedCall', {
        [variant]: self.createType(argType, params)
    });
}
