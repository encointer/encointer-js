"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callGetter = void 0;
const interface_js_1 = require("./interface.js");
const sendWorkerRequest = (self, clientRequest, parserType, options) => {
    const requestId = self.rqStack.push(parserType) + self.rsCount;
    return self.sendRequest(clientRequest, {
        timeout: options.timeout,
        requestId
    });
};
const clientRequest = (self, request) => {
    return self.createType('ClientRequest', {
        [request]: null
    });
};
const clientRequestGetter = (self, request, args) => {
    const { cid } = args;
    const getter = self.createType('PublicGetter', {
        [request]: cid
    });
    return {
        StfState: [{ public: getter }, cid]
    };
};
const requestParams = (self, address, shard) => self.createType('(AccountId, CommunityIdentifier)', [address, shard]);
const clientRequestTrustedGetter = (self, request, args) => {
    const { cid, account } = args;
    const address = account.address;
    const getter = self.createType('TrustedGetter', {
        [request]: requestParams(self, address, cid)
    });
    const signature = account.sign(getter.toU8a());
    return {
        StfState: [
            {
                trusted: {
                    getter,
                    signature
                }
            },
            cid
        ]
    };
};
const sendTrustedRequest = (self, method, parser, args, options) => sendWorkerRequest(self, clientRequestTrustedGetter(self, method, args), parser, options);
const sendPublicRequest = (self, method, parser, args, options) => sendWorkerRequest(self, clientRequestGetter(self, method, args), parser, options);
const callGetter = async (self, workerMethod, args, options = {}) => {
    if (!self.isOpened) {
        await self.open();
    }
    const [getterType, method, parser] = workerMethod;
    let result;
    let parserType = options.debug ? 'raw' : parser;
    switch (getterType) {
        case interface_js_1.Request.TrustedGetter:
            result = sendTrustedRequest(self, method, parserType, args, options);
            break;
        case interface_js_1.Request.PublicGetter:
            result = sendPublicRequest(self, method, parserType, args, options);
            break;
        case interface_js_1.Request.Worker:
            result = sendWorkerRequest(self, clientRequest(self, method), parserType, options);
            break;
        default:
            result = sendPublicRequest(self, method, parserType, args, options);
            break;
    }
    return result;
};
exports.callGetter = callGetter;
