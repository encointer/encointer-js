import assert from 'assert';
import { isPubKeyPinPair } from "@encointer/worker-api/interface.js";
import BN from "bn.js";
export const assertLength = function (upper, lower) {
    const len = upper + lower;
    assert(len >= 8, `Bit length can't be less than 8, provided ${len}`);
    assert(len <= 128, `Bit length can't be bigger than 128, provided ${len}`);
    assert(!(len & (len - 1)), `Bit length should be power of 2, provided ${len}`);
    return len;
};
export const toAccount = (accountOrPubKey, keyring) => {
    if (isPubKeyPinPair(accountOrPubKey)) {
        if (keyring !== undefined) {
            return unlockKeypair(accountOrPubKey, keyring);
        }
        else {
            throw new Error(`Can only use trusted stuff with 'PubKeyPinPair' if a keyring is set.`);
        }
    }
    return accountOrPubKey;
};
export const unlockKeypair = (pair, keyring) => {
    const keyPair = keyring.getPair(pair.pubKey);
    if (!keyPair.isLocked) {
        keyPair.lock();
    }
    keyPair.decodePkcs8(pair.pin);
    return keyPair;
};
/**
 * Our fixed point integer values go until I64, which means that it may be > 53 bits.
 * So we can't just parse the whole number with `parseInt`, as an overflow would occur.
 *
 * @param num Integer number with base 10 radix
 */
export const safeIntegerToRadix2 = function (num) {
    return new BN(num, 10).toString(2);
};
/**
 * Transforms the fractional value of a number to base 2.
 *
 * **note:** This rounds the number if the fractional digits can't be represented with 53 bits.
 *
 * @param num Integer number with base 10 radix
 */
export const fractionalToRadix2 = function (num) {
    return parseFloat('0.' + num).toString(2)
        .split('.')[1];
};
