import type {
    ShardIdentifier,
    IntegriteeTrustedCallSigned,
    IntegriteeGetter,
    GuessTheNumberInfo,
    GuessTheNumberTrustedCall,
    GuessTheNumberPublicGetter,
    GuessTheNumberTrustedGetter,
    AccountInfoAndSessionProxies,
    AttemptsArg,
    ParentchainsInfo,
    NotesBucketInfo, TimestampedTrustedNote, SessionProxyRole,
} from '@encointer/types';
import {
    type ISubmittableGetter,
    type TrustedGetterArgs,
    type TrustedSignerOptions,
    type PublicGetterArgs,
    type PublicGetterParams,
    type TrustedGetterParams,
    type TrustedCallResult,
    type ShardIdentifierArg,
    type MrenclaveArg, type AssetIdStr,
} from './interface.js';
import {Worker} from "./worker.js";
import {
    createIntegriteeGetterPublic,
    createSignedGetter,
    createTrustedCall,
    signTrustedCall, type TrustedCallArgs, type TrustedCallVariant,
} from "./requests.js";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import type { AccountInfo } from "@polkadot/types/interfaces/system";
import type {u32} from "@polkadot/types-codec";
import {asString} from "@encointer/util";
import {Vec} from "@polkadot/types";
import {
    assetIdFromString,
    enclaveFingerprintFromArg,
    shardIdentifierFromArg
} from "@encointer/worker-api/utils/typeUtils.js";
import type {Balance} from "@polkadot/types/interfaces/runtime";

export class IntegriteeWorker extends Worker {

    public async getNonce(accountOrPubKey: AddressOrPair, shard: ShardIdentifierArg, singerOptions?: TrustedSignerOptions): Promise<u32> {
        const info = await this.getAccountInfo(accountOrPubKey, shard, singerOptions);
        return info.nonce;
    }

    public async getAccountInfo(accountOrPubKey: AddressOrPair, shard: ShardIdentifierArg, singerOptions?: TrustedSignerOptions): Promise<AccountInfo> {
        const getter = await this.accountInfoGetter(accountOrPubKey, shard, singerOptions);
        return getter.send();
    }

    public async accountInfoGetter(accountOrPubKey: AddressOrPair, shard: ShardIdentifierArg, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, AccountInfo>> {
        const trustedGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
            account: accountOrPubKey,
            delegate: signerOptions?.delegate,
            signer: signerOptions?.signer,
        }
        return await submittableTrustedGetter<IntegriteeWorker, AccountInfo>(this, 'account_info', accountOrPubKey, trustedGetterArgs, asString(accountOrPubKey), 'AccountInfo');
    }

    public async accountInfoAndSessionProxiesGetter(accountOrPubKey: AddressOrPair, shard: ShardIdentifierArg, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, AccountInfoAndSessionProxies>> {
        const trustedGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
            account: accountOrPubKey,
            delegate: signerOptions?.delegate,
            signer: signerOptions?.signer,
        }
        return await submittableTrustedGetter<IntegriteeWorker, AccountInfoAndSessionProxies>(this, 'account_info_and_session_proxies', accountOrPubKey, trustedGetterArgs, asString(accountOrPubKey), 'AccountInfoAndSessionProxies');
    }

    public parentchainsInfoGetter(shard: ShardIdentifierArg): SubmittableGetter<IntegriteeWorker, ParentchainsInfo> {
        const publicGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
        }
        return submittablePublicGetter<IntegriteeWorker, ParentchainsInfo>(this, 'parentchains_info', publicGetterArgs, null, 'ParentchainsInfo');
    }

    public noteBucketsInfoGetter(shard: ShardIdentifierArg): SubmittableGetter<IntegriteeWorker, NotesBucketInfo> {
        const publicGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
        }
        return submittablePublicGetter<IntegriteeWorker, NotesBucketInfo>(this, 'note_buckets_info', publicGetterArgs, null, 'NotesBucketInfo');
    }

    public undistributedFeesGetter(shard: ShardIdentifierArg, assetId: AssetIdStr | null): SubmittableGetter<IntegriteeWorker, Balance> {
        const publicGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
        }

        let maybeAsset = assetId != null ?  assetIdFromString(assetId as AssetIdStr, this.registry()) : null;
        const getterParams =  this.createType('Option<IntegriteeAssetId>', maybeAsset);
        return submittablePublicGetter<IntegriteeWorker, Balance>(this, 'undistributed_fees', publicGetterArgs, getterParams, 'Balance');
    }

    public assetTotalIssuanceGetter(shard: ShardIdentifierArg, assetId: AssetIdStr): SubmittableGetter<IntegriteeWorker, Balance> {
        const publicGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
        }

        let asset = assetIdFromString(assetId, this.registry());
        return submittablePublicGetter<IntegriteeWorker, Balance>(this, 'asset_total_issuance', publicGetterArgs, asset, 'Balance');
    }

    public async assetBalanceGetter(accountOrPubKey: AddressOrPair, assetId: AssetIdStr, shard: ShardIdentifierArg, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, Balance>> {
        const trustedGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
            account: accountOrPubKey,
            delegate: signerOptions?.delegate,
            signer: signerOptions?.signer,
        }
        let asset = assetIdFromString(assetId, this.registry());
        const assetBalanceArgs = this.createType('AssetBalanceArgs', [asString(accountOrPubKey), asset]);
        return await submittableTrustedGetter<IntegriteeWorker, Balance>(this, 'asset_balance', accountOrPubKey, trustedGetterArgs, assetBalanceArgs,'Balance');
    }

    public async notesForTrustedGetter(accountOrPubKey: AddressOrPair, bucketIndex: number, shard: ShardIdentifierArg, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, Vec<TimestampedTrustedNote>>> {
        const trustedGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
            account: accountOrPubKey,
            delegate: signerOptions?.delegate,
            signer: signerOptions?.signer,
        }
        const notesForArgs = this.createType('NotesForArgs', [asString(accountOrPubKey), bucketIndex]);
        return await submittableTrustedGetter<IntegriteeWorker, Vec<TimestampedTrustedNote>>(this, 'notes_for', accountOrPubKey, trustedGetterArgs, notesForArgs,'Vec<TimestampedTrustedNote>');
    }

    public guessTheNumberInfoGetter(shard: ShardIdentifierArg): SubmittableGetter<IntegriteeWorker, GuessTheNumberInfo> {
        const publicGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
        }
        const getterParams = guessTheNumberPublicGetter(this, 'guess_the_number_info');
        return submittablePublicGetter<IntegriteeWorker, GuessTheNumberInfo>(this, 'guess_the_number', publicGetterArgs, getterParams, 'GuessTheNumberInfo');
    }

    public async guessTheNumberAttemptsTrustedGetter(accountOrPubKey: AddressOrPair, shard: ShardIdentifierArg, signerOptions?: TrustedSignerOptions): Promise<SubmittableGetter<IntegriteeWorker, AccountInfo>> {
        const trustedGetterArgs = {
            shard: shardIdentifierFromArg(shard, this.registry()),
            account: accountOrPubKey,
            delegate: signerOptions?.delegate,
            signer: signerOptions?.signer,
        }
        const args = this.createType('AttemptsArg', {origin:  asString(accountOrPubKey)});
        const getterParams = guessTheNumberTrustedGetter(this, 'attempts', args);
        return await submittableTrustedGetter<IntegriteeWorker, AccountInfo>(this, 'guess_the_number', accountOrPubKey, trustedGetterArgs, getterParams,'u8');
    }

    public async trustedBalanceTransfer(
        account: AddressOrPair,
        shard: ShardIdentifierArg,
        mrenclave: MrenclaveArg,
        from: String,
        to: String,
        amount: number,
        note?: string,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());

        let call;
        if (note == null) {
            const params = this.createType('BalanceTransferArgs', [from, to, amount])
            call = createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], params);
        } else {
            const params = this.createType('BalanceTransferWithNoteArgs', [from, to, amount, note])
            call = createTrustedCall(this, ['balance_transfer_with_note', 'BalanceTransferWithNoteArgs'], params);
        }

        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async trustedAssetTransfer(
        account: AddressOrPair,
        shard: ShardIdentifierArg,
        mrenclave: MrenclaveArg,
        from: String,
        to: String,
        amount: number,
        assetId: AssetIdStr,
        note?: string,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());
        const asset = assetIdFromString(assetId, this.registry());

        let call;
        if (note == null) {
            const params = this.createType('AssetsTransferArgs', [from, to, asset, amount])
            call = createTrustedCall(this, ['assets_transfer', 'AssetsTransferArgs'], params);
        } else {
            const params = this.createType('AssetsTransferWithNoteArgs', [from, to, asset, amount, note])
            call = createTrustedCall(this, ['assets_transfer_with_note', 'AssetsTransferWithNoteArgs'], params);
        }

        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async balanceUnshieldFunds(
        account: AddressOrPair,
        shard: ShardIdentifierArg,
        mrenclave: MrenclaveArg,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());

        const params = this.createType('BalanceUnshieldArgs', [fromIncognitoAddress, toPublicAddress, amount, shardT])
        const call = createTrustedCall(this, ['balance_unshield', 'BalanceUnshieldArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    /**
     * Use enclave bridge instead of shard vault account. Only do this if you know what you're doing.
     */
    public async balanceUnshieldThroughEnclaveBridgePalletFunds(
        account: AddressOrPair,
        shard: ShardIdentifierArg,
        mrenclave: MrenclaveArg,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());

        const params = this.createType('BalanceUnshieldThroughEnclaveBridgePalletArgs', [fromIncognitoAddress, toPublicAddress, amount, shardT])
        const call = createTrustedCall(this, [
            'balance_unshield_through_enclave_bridge_pallet',
            'BalanceUnshieldThroughEnclaveBridgePalletArgs'
        ], params);

        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async assetUnshieldFunds(
        account: AddressOrPair,
        shard: ShardIdentifierArg,
        mrenclave: MrenclaveArg,
        fromIncognitoAddress: string,
        toPublicAddress: string,
        amount: number,
        assetId: AssetIdStr,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions);
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());
        let asset = assetIdFromString(assetId, this.registry());

        const params = this.createType('AssetsUnshieldArgs', [fromIncognitoAddress, toPublicAddress, asset, amount, shardT])
        const call = createTrustedCall(this, ['assets_unshield', 'AssetsUnshieldArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async trustedAddSessionProxy(
      account: AddressOrPair,
      shard: ShardIdentifierArg,
      mrenclave: MrenclaveArg,
      role: SessionProxyRole,
      delegate: AddressOrPair,
      expiry: number,
      seed: Uint8Array,
      signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());

        const credentials = this.createType('SessionProxyCredentials', [role, expiry, seed])
        const params = this.createType('AddSessionProxyArgs', [asString(account), asString(delegate), credentials])
        const call = createTrustedCall(this, ['add_session_proxy', 'AddSessionProxyArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);

        console.debug(`AddSessionProxy ${JSON.stringify(signed)}`);
        return this.sendTrustedCall(signed, shardT);
    }

    public async trustedSendNote(
      account: AddressOrPair,
      shard: ShardIdentifierArg,
      mrenclave: MrenclaveArg,
      from: String,
      to: String,
      note: string,
      signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());

        const params = this.createType('SendNoteArgs', [from, to, note])
        const call = createTrustedCall(this, ['send_note', 'SendNoteArgs'], params);
        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);
        return this.sendTrustedCall(signed, shardT);
    }

    public async guessTheNumber(
        account: AddressOrPair,
        shard: ShardIdentifierArg,
        mrenclave: MrenclaveArg,
        guess: number,
        signerOptions?: TrustedSignerOptions,
    ): Promise<TrustedCallResult> {
        const nonce = signerOptions?.nonce ?? await this.getNonce(account, shard, signerOptions)
        const shardT = shardIdentifierFromArg(shard, this.registry());
        const fingerprint = enclaveFingerprintFromArg(mrenclave, this.registry());

        const params = this.createType('GuessArgs', [asString(account), guess])
        const guessThNumberCall = guessTheNumberCall(this, ['guess', 'GuessArgs'], params);
        const call = createTrustedCall(this, ['guess_the_number', 'GuessTheNumberTrustedCall'], guessThNumberCall);
        const signed = await signTrustedCall(this, call, account, shardT, fingerprint, nonce, signerOptions);

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
    const signedGetter = await createSignedGetter(self, request, account, trustedGetterParams, { signer: args?.signer, delegate: args?.delegate });
    return new SubmittableGetter<W, T>(self, shard, signedGetter, returnType);
}


function submittablePublicGetter<W extends Worker, T>(self: W, request: string, args: PublicGetterArgs, publicGetterParams: PublicGetterParams, returnType: string): SubmittableGetter<W, T> {
    const {shard} = args;
    const signedGetter = createIntegriteeGetterPublic(self, request, publicGetterParams)
    return new SubmittableGetter<W, T>(self, shard, signedGetter, returnType);
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
