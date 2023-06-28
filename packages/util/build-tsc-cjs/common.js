"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fractionalToRadix2 = exports.safeIntegerToRadix2 = exports.unlockKeypair = exports.toAccount = exports.assertLength = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const interface_js_1 = require("@encointer/worker-api/interface.js");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const assertLength = function (upper, lower) {
    const len = upper + lower;
    (0, assert_1.default)(len >= 8, `Bit length can't be less than 8, provided ${len}`);
    (0, assert_1.default)(len <= 128, `Bit length can't be bigger than 128, provided ${len}`);
    (0, assert_1.default)(!(len & (len - 1)), `Bit length should be power of 2, provided ${len}`);
    return len;
};
exports.assertLength = assertLength;
const toAccount = (accountOrPubKey, keyring) => {
    if ((0, interface_js_1.isPubKeyPinPair)(accountOrPubKey)) {
        if (keyring !== undefined) {
            return (0, exports.unlockKeypair)(accountOrPubKey, keyring);
        }
        else {
            throw new Error(`Can only use trusted stuff with 'PubKeyPinPair' if a keyring is set.`);
        }
    }
    return accountOrPubKey;
};
exports.toAccount = toAccount;
const unlockKeypair = (pair, keyring) => {
    const keyPair = keyring.getPair(pair.pubKey);
    if (!keyPair.isLocked) {
        keyPair.lock();
    }
    keyPair.decodePkcs8(pair.pin);
    return keyPair;
};
exports.unlockKeypair = unlockKeypair;
/**
 * Our fixed point integer values go until I64, which means that it may be > 53 bits.
 * So we can't just parse the whole number with `parseInt`, as an overflow would occur.
 *
 * @param num Integer number with base 10 radix
 */
const safeIntegerToRadix2 = function (num) {
    return new bn_js_1.default(num, 10).toString(2);
};
exports.safeIntegerToRadix2 = safeIntegerToRadix2;
/**
 * Transforms the fractional value of a number to base 2.
 *
 * **note:** This rounds the number if the fractional digits can't be represented with 53 bits.
 *
 * @param num Integer number with base 10 radix
 */
const fractionalToRadix2 = function (num) {
    return parseFloat('0.' + num).toString(2)
        .split('.')[1];
};
exports.fractionalToRadix2 = fractionalToRadix2;
