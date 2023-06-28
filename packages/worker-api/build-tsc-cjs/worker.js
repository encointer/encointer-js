"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncointerWorker = void 0;
const tslib_1 = require("tslib");
const types_1 = require("@polkadot/types");
const util_1 = require("@polkadot/util");
const websocket_as_promised_1 = tslib_1.__importDefault(require("websocket-as-promised"));
const index_js_1 = require("@encointer/node-api/index.js");
const index_js_2 = require("@encointer/util/index.js");
const interface_js_1 = require("./interface.js");
const parsers_js_1 = require("./parsers.js");
const getterApi_js_1 = require("./getterApi.js");
const trustedCallApi_js_1 = require("@encointer/worker-api/trustedCallApi.js");
const common_js_1 = require("@encointer/util/common.js");
const unwrapWorkerResponse = (self, data) => {
    /// Unwraps the value that is wrapped in all the Options and encoding from the worker.
    /// Defaults to return `[]`, which is fine as `createType(api.registry, <type>, [])`
    /// instantiates the <type> with its default value.
    const dataTyped = self.createType('Option<WorkerEncoded>', (0, util_1.hexToU8a)('0x'.concat(data)))
        .unwrapOrDefault(); // (Option<Value.enc>.enc+whitespacePad)
    const trimmed = (0, util_1.u8aToHex)(dataTyped).replace(/(20)+$/, '');
    const unwrappedData = self.createType('Option<WorkerEncoded>', (0, util_1.hexToU8a)(trimmed))
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
                parsedData = (0, parsers_js_1.parseBalance)(self, parsedData);
                break;
            case 'I64F64':
                parsedData = unwrapWorkerResponse(self, data);
                parsedData = (0, index_js_2.parseI64F64)(self.createType('i128', parsedData));
                break;
            case 'NodeRSA':
                parsedData = (0, parsers_js_1.parseNodeRSA)(data);
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
class EncointerWorker extends websocket_as_promised_1.default {
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
        this.__internal__registry = new types_1.TypeRegistry();
        this.rsCount = 0;
        this.rqStack = [];
        if (api) {
            this.__internal__registry = api.registry;
        }
        else if (types) {
            this.__internal__registry.register((0, index_js_1.options)({ types: options.types }).types);
        }
        else {
            this.__internal__registry.register((0, index_js_1.options)().types);
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
        return (0, index_js_2.communityIdentifierFromString)(this.__internal__registry, cidStr);
    }
    async getShieldingKey(options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.Worker, 'PubKeyWorker', 'NodeRSA'], {}, options);
    }
    async getTotalIssuance(cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'total_issuance', 'Balance'], { cid }, options);
    }
    async getParticipantCount(cid, options = {}) {
        return (await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'participant_count', 'u64'], { cid }, options)).toNumber();
    }
    async getMeetupCount(cid, options = {}) {
        return (await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'meetup_count', 'u64'], { cid }, options)).toNumber();
    }
    async getCeremonyReward(cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'ceremony_reward', 'I64F64'], { cid }, options);
    }
    async getLocationTolerance(cid, options = {}) {
        return (await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'location_tolerance', 'u32'], { cid }, options)).toNumber();
    }
    async getTimeTolerance(cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'time_tolerance', 'Moment'], { cid }, options);
    }
    async getSchedulerState(cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.PublicGetter, 'scheduler_state', 'SchedulerState'], { cid }, options);
    }
    async getBalance(accountOrPubKey, cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.TrustedGetter, 'balance', 'BalanceEntry'], {
            cid,
            account: (0, common_js_1.toAccount)(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getParticipantIndex(accountOrPubKey, cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.TrustedGetter, 'participant_index', 'ParticipantIndexType'], {
            cid,
            account: (0, common_js_1.toAccount)(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getMeetupIndex(accountOrPubKey, cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.TrustedGetter, 'meetup_index', 'MeetupIndexType'], {
            cid,
            account: (0, common_js_1.toAccount)(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getAttestations(accountOrPubKey, cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.TrustedGetter, 'attestations', 'Vec<Attestation>'], {
            cid,
            account: (0, common_js_1.toAccount)(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    async getMeetupRegistry(accountOrPubKey, cid, options = {}) {
        return await (0, getterApi_js_1.callGetter)(this, [interface_js_1.Request.TrustedGetter, 'meetup_registry', 'Vec<AccountId>'], {
            cid,
            account: (0, common_js_1.toAccount)(accountOrPubKey, this.__internal__keyring)
        }, options);
    }
    trustedCallBalanceTransfer(accountOrPubKey, cid, mrenclave, nonce, params) {
        return (0, trustedCallApi_js_1.createTrustedCall)(this, ['balance_transfer', 'BalanceTransferArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
    trustedCallRegisterParticipant(accountOrPubKey, cid, mrenclave, nonce, params) {
        return (0, trustedCallApi_js_1.createTrustedCall)(this, ['ceremonies_register_participant', 'RegisterParticipantArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
    trustedCallRegisterAttestations(accountOrPubKey, cid, mrenclave, nonce, params) {
        return (0, trustedCallApi_js_1.createTrustedCall)(this, ['ceremonies_register_attestations', 'RegisterAttestationsArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
    trustedCallGrantReputation(accountOrPubKey, cid, mrenclave, nonce, params) {
        return (0, trustedCallApi_js_1.createTrustedCall)(this, ['ceremonies_grant_reputation', 'GrantReputationArgs'], accountOrPubKey, cid, mrenclave, nonce, params);
    }
}
exports.EncointerWorker = EncointerWorker;
