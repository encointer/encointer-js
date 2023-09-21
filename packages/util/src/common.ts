import assert from 'assert';
import type { KeyringPair } from "@polkadot/keyring/types";
import { Keyring } from "@polkadot/keyring";
import BN from "bn.js";

interface assertLengthFunc {
  (upper: number, lower: number): number
}

export const assertLength: assertLengthFunc = function (upper, lower) {
  const len = upper + lower;
  assert(len >= 8, `Bit length can't be less than 8, provided ${len}`);
  assert(len <= 128, `Bit length can't be bigger than 128, provided ${len}`);
  assert(!(len & (len - 1)), `Bit length should be power of 2, provided ${len}`);
  return len;
};

export interface PubKeyPinPair {
  pubKey: string,
  pin: string,
}

export function isPubKeyPinPair(pair: KeyringPair | PubKeyPinPair) {
  return (pair as PubKeyPinPair).pin !== undefined;
}

export const toAccount = (accountOrPubKey: (KeyringPair | PubKeyPinPair), keyring?: Keyring): KeyringPair => {
  if (isPubKeyPinPair(accountOrPubKey)) {
    if (keyring !== undefined) {
      return unlockKeypair(accountOrPubKey as PubKeyPinPair, keyring)
    } else {
      throw  new Error(`Can only use trusted stuff with 'PubKeyPinPair' if a keyring is set.`);
    }
  }

  return accountOrPubKey as KeyringPair
}

export const unlockKeypair = (pair: PubKeyPinPair, keyring: Keyring): KeyringPair => {
  const keyPair = keyring.getPair(pair.pubKey);
  if (!keyPair.isLocked) {
    keyPair.lock();
  }
  keyPair.decodePkcs8(pair.pin);
  return keyPair;
}


/**
 * Our fixed point integer values go until I64, which means that it may be > 53 bits.
 * So we can't just parse the whole number with `parseInt`, as an overflow would occur.
 *
 * @param num Integer number with base 10 radix
 */
export const safeIntegerToRadix2 = function(num: string): string {
  return new BN(num, 10).toString(2)
}

/**
 * Transforms the fractional value of a number to base 2.
 *
 * **note:** This rounds the number if the fractional digits can't be represented with 53 bits.
 *
 * @param num Integer number with base 10 radix
 */
export const fractionalToRadix2 = function(num: string): string {
  return parseFloat('0.' + num).toString(2)
      .split('.')[1];
}
