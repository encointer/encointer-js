import assert from 'assert';
import BN from 'bn.js';
import { bnToU8a } from '@polkadot/util';

import {assertLength} from './common';

export interface EncodeFloatToFixPointFn {
  (num: number): Uint8Array;
}

export interface EncodeFloatToFixPointFactory {
  (upper: number, lower: number): EncodeFloatToFixPointFn;
}

export const encodeFloatToFixPoint: EncodeFloatToFixPointFactory = function (upper, lower) {
  assertLength(upper, lower);
  return (num: number): Uint8Array => {
    const [upperBits, lowerBits] = num.toString(2).split('.');

    return toFixed(upperBits, lowerBits, upper, lower)
  };
}

/**
 * Encodes a fixed-point number ready for an extrinsic
 *
 * @param integers integer bits as string with radix 2.
 * @param fractions fractional bits as string with radix 2.
 * @param integer_count amount of integer bits in the fixed-point type.
 * @param fractions_count amount of fractional bits in the fixed-point type.
 */
const toFixed = function(integers: string, fractions: string, integer_count: number, fractions_count: number): Uint8Array {
  assertLength(integer_count, fractions_count);

  assert(integers.length <= integer_count, 'Number is larger than maximum in '.concat(integer_count.toString(), 'bit'));
  if (fractions !== undefined) {
    const lowerPadded = fractions.length > fractions_count ? fractions.substr(0, fractions_count) : fractions.padEnd(fractions_count, '0');
    const upperPadded = integers.padStart(integer_count, '0');
    const upperBN = bnToU8a(new BN(upperPadded, 2), integer_count, true);
    const lowerBN = bnToU8a(new BN(lowerPadded, 2), fractions_count, true);
    return Uint8Array.from([...lowerBN, ...upperBN]);
  } else {
    const bits = integers.padStart(integer_count, '0').padEnd(fractions_count + integer_count, '0');
    return bnToU8a(new BN(bits, 2), fractions_count + integer_count, true);
  }
}


