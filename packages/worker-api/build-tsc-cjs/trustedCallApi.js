"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrustedCall = void 0;
const tslib_1 = require("tslib");
const bs58_1 = tslib_1.__importDefault(require("bs58"));
const common_js_1 = require("@encointer/util/common.js");
const createTrustedCall = (self, trustedCall, accountOrPubKey, cid, mrenclave, nonce, params) => {
    const [variant, argType] = trustedCall;
    const hash = self.createType('Hash', bs58_1.default.decode(mrenclave));
    const call = self.createType('TrustedCall', {
        [variant]: self.createType(argType, params)
    });
    const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...hash.toU8a(), ...cid.toU8a()]);
    return self.createType('TrustedCallSigned', {
        call: call,
        nonce: nonce,
        signature: (0, common_js_1.toAccount)(accountOrPubKey, self.keyring()).sign(payload)
    });
};
exports.createTrustedCall = createTrustedCall;
