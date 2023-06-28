"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNodeRSA = exports.parseBalanceType = exports.parseBalance = void 0;
const tslib_1 = require("tslib");
const index_js_1 = require("@encointer/util/index.js");
const util_1 = require("@polkadot/util");
const node_rsa_1 = tslib_1.__importDefault(require("node-rsa"));
function parseBalance(self, data) {
    const balanceEntry = self.createType('BalanceEntry<BlockNumber>', data);
    // Todo: apply demurrage
    return self.createType('BalanceEntry<BlockNumber>', {
        principal: (0, index_js_1.parseI64F64)(balanceEntry.principal),
        last_update: balanceEntry.last_update
    });
}
exports.parseBalance = parseBalance;
function parseBalanceType(data) {
    return (0, index_js_1.parseI64F64)((0, util_1.u8aToBn)(data));
}
exports.parseBalanceType = parseBalanceType;
function parseNodeRSA(data) {
    const keyJson = JSON.parse(data);
    keyJson.n = (0, util_1.u8aToBuffer)(keyJson.n).reverse();
    keyJson.e = (0, util_1.u8aToBuffer)(keyJson.e).reverse();
    const key = new node_rsa_1.default();
    setKeyOpts(key);
    key.importKey({
        n: keyJson.n,
        e: keyJson.e
    }, 'components-public');
    return key;
}
exports.parseNodeRSA = parseNodeRSA;
function setKeyOpts(key) {
    key.setOptions({
        encryptionScheme: {
            scheme: 'pkcs1_oaep',
            hash: 'sha256',
            label: ''
        }
    });
}
