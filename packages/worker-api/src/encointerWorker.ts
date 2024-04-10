import type {u32, u64, Vec} from '@polkadot/types';
import {communityIdentifierFromString} from '@encointer/util';

// @ts-ignore
import NodeRSA from 'node-rsa';

import type {
    CommunityIdentifier,
    MeetupIndexType,
    ParticipantIndexType,
    SchedulerState,
    Attestation,
} from '@encointer/types';

import {type CallOptions, Request} from './interface.js';
import {callGetter} from './sendRequest.js';
import {PubKeyPinPair, toAccount} from "@encointer/util/common";
import type {KeyringPair} from "@polkadot/keyring/types";
import {Worker} from "./worker.js";
import type {AccountId, Balance, Moment} from "@polkadot/types/interfaces/runtime";

// Todo: This code is a WIP and will not work as is: https://github.com/encointer/encointer-js/issues/91

export class EncointerWorker extends Worker {

    public cidFromStr(cidStr: String): CommunityIdentifier {
        return communityIdentifierFromString(this.registry(), cidStr);
    }

    public async getNonce(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<u32> {
        return await callGetter<u32>(this, [Request.TrustedGetter, 'nonce', 'u32'], {
            shard: cid,
            account: toAccount(accountOrPubKey, this.keyring())
        }, options)
    }

    public async getTotalIssuance(cid: string, options: CallOptions = {} as CallOptions): Promise<Balance> {
        return await callGetter<Balance>(this, [Request.PublicGetter, 'total_issuance', 'Balance'], {cid}, options)
    }

    public async getParticipantCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
        return (await callGetter<u64>(this, [Request.PublicGetter, 'participant_count', 'u64'], {cid}, options)).toNumber()
    }

    public async getMeetupCount(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
        return (await callGetter<u64>(this, [Request.PublicGetter, 'meetup_count', 'u64'], {cid}, options)).toNumber()
    }

    public async getCeremonyReward(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
        return await callGetter<number>(this, [Request.PublicGetter, 'ceremony_reward', 'I64F64'], {cid}, options)
    }

    public async getLocationTolerance(cid: string, options: CallOptions = {} as CallOptions): Promise<number> {
        return (await callGetter<u32>(this, [Request.PublicGetter, 'location_tolerance', 'u32'], {cid}, options)).toNumber()
    }

    public async getTimeTolerance(cid: string, options: CallOptions = {} as CallOptions): Promise<Moment> {
        return await callGetter<Moment>(this, [Request.PublicGetter, 'time_tolerance', 'Moment'], {cid}, options)
    }

    public async getSchedulerState(cid: string, options: CallOptions = {} as CallOptions): Promise<SchedulerState> {
        return await callGetter<SchedulerState>(this, [Request.PublicGetter, 'scheduler_state', 'SchedulerState'], {cid}, options)
    }

    public async getBalance(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Balance> {
        return await callGetter<Balance>(this, [Request.TrustedGetter, 'free_balance', 'Balance'], {
            shard: cid,
            account: toAccount(accountOrPubKey,this.keyring())
        }, options)
    }

    public async getParticipantIndex(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<ParticipantIndexType> {
        return await callGetter<ParticipantIndexType>(this, [Request.TrustedGetter, 'participant_index', 'ParticipantIndexType'], {
            cid,
            account: toAccount(accountOrPubKey,this.keyring())
        }, options)
    }

    public async getMeetupIndex(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<MeetupIndexType> {
        return await callGetter<MeetupIndexType>(this, [Request.TrustedGetter, 'meetup_index', 'MeetupIndexType'], {
            cid,
            account: toAccount(accountOrPubKey,this.keyring())
        }, options)
    }

    public async getAttestations(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Vec<Attestation>> {
        return await callGetter<Vec<Attestation>>(this, [Request.TrustedGetter, 'attestations', 'Vec<Attestation>'], {
            cid,
            account: toAccount(accountOrPubKey,this.keyring())
        }, options)
    }

    public async getMeetupRegistry(accountOrPubKey: KeyringPair | PubKeyPinPair, cid: string, options: CallOptions = {} as CallOptions): Promise<Vec<AccountId>> {
        return await callGetter<Vec<AccountId>>(this, [Request.TrustedGetter, 'meetup_registry', 'Vec<AccountId>'], {
            cid,
            account: toAccount(accountOrPubKey, this.keyring())
        }, options)
    }

    // Todo: `sendTrustedCall` must be generic over the trusted call or we have to duplicate code for encointer.
    // async sendTrustedCall(call: EncointerTrustedCallSigned, shard: ShardIdentifier, options: CallOptions = {} as CallOptions):  Promise<Hash> {
    //     if (this.shieldingKey() == undefined) {
    //         const key = await this.getShieldingKey(options);
    //         console.log(`Setting the shielding pubKey of the worker.`)
    //         this.setShieldingKey(key);
    //     }
    //
    //     return sendTrustedCall<Hash>(this, call, shard, true, 'TrustedOperationResult', options);
    // }
}
