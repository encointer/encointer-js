import bs58 from "bs58";
import { toAccount } from "@encointer/util/common.js";
export const createTrustedCall = (self, trustedCall, accountOrPubKey, cid, mrenclave, nonce, params) => {
    const [variant, argType] = trustedCall;
    const hash = self.createType('Hash', bs58.decode(mrenclave));
    const call = self.createType('TrustedCall', {
        [variant]: self.createType(argType, params)
    });
    const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...hash.toU8a(), ...cid.toU8a()]);
    return self.createType('TrustedCallSigned', {
        call: call,
        nonce: nonce,
        signature: toAccount(accountOrPubKey, self.keyring()).sign(payload)
    });
};
