import { TypeRegistry } from '@polkadot/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';
import WebSocketAsPromised from 'websocket-as-promised';
import { options as encointerOptions } from '@encointer/node-api/index.js';
import { communityIdentifierFromString, parseI64F64 } from '@encointer/util/index.js';
import { Request } from './interface.js';
import { parseBalance, parseNodeRSA } from './parsers.js';
import { callGetter } from './getterApi.js';
import { createTrustedCall } from "@encointer/worker-api/trustedCallApi.js";
import { toAccount } from "@encointer/util/common.js";
const unwrapWorkerResponse = (self, data) => {
    /// Unwraps the value that is wrapped in all the Options and encoding from the worker.
    /// Defaults to return `[]`, which is fine as `createType(api.registry, <type>, [])`
    /// instantiates the <type> with its default value.
    const dataTyped = self.createType('Option<WorkerEncoded>', hexToU8a('0x'.concat(data)))
        .unwrapOrDefault(); // (Option<Value.enc>.enc+whitespacePad)
    const trimmed = u8aToHex(dataTyped).replace(/(20)+$/, '');
    const unwrappedData = self.createType('Option<WorkerEncoded>', hexToU8a(trimmed))
        .unwrapOrDefault();
    return unwrappedData;
};
const parseGetterResponse = (self, responseType, data) => {
    if (data === 'Could not decode request') {
        throw new Error(`Worker error: ${data}`);
    }
    let parsedData;
    try {
        switch (responseType) {
            case 'raw':
                parsedData = unwrapWorkerResponse(self, data);
                break;
            case 'BalanceEntry':
                parsedData = unwrapWorkerResponse(self, data);
                parsedData = parseBalance(self, parsedData);
                break;
            case 'I64F64':
                parsedData = unwrapWorkerResponse(self, data);
                parsedData = parseI64F64(self.createType('i128', parsedData));
                break;
            case 'NodeRSA':
                parsedData = parseNodeRSA(data);
                break;
            default:
                parsedData = unwrapWorkerResponse(self, data);
                parsedData = self.createType(responseType, parsedData);
                break;
        }
    }
    catch (err) {
        throw new Error(`Can't parse into ${responseType}:\n${err}`);
    }
    return parsedData;
};
export class EncointerWorker extends WebSocketAsPromised {
    constructor(url, options = {}) {
        super(url, {
            createWebSocket: (options.createWebSocket || undefined),
            packMessage: (data) => this.createType('ClientRequest', data).toU8a(),
            unpackMessage: (data) => parseGetterResponse(this, this.rqStack.shift() || '', data),
            attachRequestId: (data) => data,
            extractRequestId: () => this.rsCount = ++this.rsCount
        });
        const { api, types } = options;
        this.__internal__keyring = (options.keyring || undefined);
        this.__internal__registry = new TypeRegistry();
        this.rsCount = 0;
        this.rqStack = [];
        if (api) {
            this.__internal__registry = api.registry;
        }
        else if (types) {
            this.__internal__registry.register(encointerOptions({ types: options.types }).types);
        }
        else {
            this.__internal__registry.register(encointerOptions().types);
        }
    }
    createType(apiType, obj) {
        return this.__internal__registry.createType(apiType, obj);
    }
    keyring() {
        return this.__internal__keyring;
    }
    setKeyring(keyring) {
        this.__internal__keyring = keyring;
    }
    cidFromStr(cidStr) {
        return communityIdentifierFromString(this.__internal__registry, cidStr);
    }
    async getShieldingKey(options = {}) {
        return await callGetter(this, [Request.Worker, 'PubKeyWorker', 'NodeRSA'], {}, options);
    }
    async getTotalIssuance(cid, options = {}) {
        return await callGetter(this, [Request.PublicGetter, 'total_issuance', 'Balance'], { cid }, options);
    }
    async getParticipantCount(cid, options = {}) {
        return (await callGetter(this, [Request.PublicGetter, 'participant_count', 'u64'], { cid }, options)).toNumber();
    }
    async getMeetupCount(cid, options = {}) {
        return (await callGetter(this, [Request.PublicGetter, 'meetup_count', 'u64'], { cid }, options)).toNumber();
    }
    async getCeremonyReward(cid, options = {}) {
        return await callGetter(this, [Request.PublicGetter, 'ceremony_reward', 'I64F64'], { cid }, options);
    }
    async getLocationTolerance(cid, options = {}) {
        return (await callGetter(this, [Request.PublicGetter, 'location_tolerance', 'u32'], { cid }, options)).toNumber();
    }
    async getTimeTolerance(cid, options = {}) {
        return await callGetter(this, [Request.PublicGetter, 'time_tolerance', 'Moment'], { cid }, options);
    }
    async getSchedulerState(cid, options = {}) {
        return await callGetter(this, [Request.PublicGetter, 'scheduler_state', 'SchedulerState'], { cid }, options);
    }
    async getBalance(accountOrPubKey, cid, options = {}) {
        return await callGetter(this, [Request.TrustedGetter, 'balance', 'BalanceEntry'], {
            cid,
            account: toAccount(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getParticipantIndex(accountOrPubKey, cid, options = {}) {
        return await callGetter(this, [Request.TrustedGetter, 'participant_index', 'ParticipantIndexType'], {
            cid,
            account: toAccount(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getMeetupIndex(accountOrPubKey, cid, options = {}) {
        return await callGetter(this, [Request.TrustedGetter, 'meetup_index', 'MeetupIndexType'], {
            cid,
            account: toAccount(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getAttestations(accountOrPubKey, cid, options = {}) {
        return await callGetter(this, [Request.TrustedGetter, 'attestations', 'Vec<Attestation>'], {
            cid,
            account: toAccount(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getMeetupRegistry(accountOrPubKey, cid, options = {}) {
        return await callGetter(this, [Request.TrustedGetter, 'meetup_registry', 'Vec<AccountId>'], {
            cid,
            account: toAccount(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    trustedCallBalanceTransfer(accountOrPubKey, cid, mrenclave, nonce, params) {
        return createTrustedCall(this, ['balance_transfer', 'BalanceTransferArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
    trustedCallRegisterParticipant(accountOrPubKey, cid, mrenclave, nonce, params) {
        return createTrustedCall(this, ['ceremonies_register_participant', 'RegisterParticipantArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
    trustedCallRegisterAttestations(accountOrPubKey, cid, mrenclave, nonce, params) {
        return createTrustedCall(this, ['ceremonies_register_attestations', 'RegisterAttestationsArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
    trustedCallGrantReputation(accountOrPubKey, cid, mrenclave, nonce, params) {
        return createTrustedCall(this, ['ceremonies_grant_reputation', 'GrantReputationArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
}
