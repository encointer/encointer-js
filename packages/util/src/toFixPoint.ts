import assert from 'assert';
import BN from 'bn.js';

import { assertLength } from './common';

export interface ToFixPointFn {
  (num: number): BN;
}

export interface StringToFixPointFn {
  (num: string): BN;
}

export interface ToFixPointFactory {
  (upper: number, lower: number): ToFixPointFn
}

export interface StringToFixPointFactory {
  (upper: number, lower: number): StringToFixPointFn
}

export const toFixPoint: ToFixPointFactory = function (upper, lower) {
  assertLength(upper, lower);
  return (num: number): BN => {
    const [upperBits, lowerBits] = num.toString(2).split('.');

    return toFixed(upperBits, lowerBits, upper, lower)
  };
};

export const stringToFixPoint: StringToFixPointFactory = function (upper, lower) {
  assertLength(upper, lower);
  return (num: string): BN => {
    const [integers, fractions] = num.split('.').map((num) => safeRadix10ToRadix2(num));

    return toFixed(integers, fractions, upper, lower)
  };
};

/**
 * Creates a fixed-point number representation.
 *
 * @param integers integer bits as string with radix 2.
 * @param fractions fractional bits as string with radix 2.
 * @param integer_count amount of integer bits in the fixed-point type.
 * @param fractions_count amount of fractional bits in the fixed-point type.
 */
const toFixed = function(integers: string, fractions: string, integer_count: number, fractions_count: number): BN {
  assertLength(integer_count, fractions_count);

  assert(integers.length <= integer_count, 'Number is larger than maximum in '.concat(integer_count.toString(), 'bit'));

  if (fractions !== undefined) {
   const bits = integers.concat(fractions.length > fractions_count ? fractions.substring(0, fractions_count) : fractions.padEnd(fractions_count, '0'));
   return new BN(bits, 2);
  } else {
   const bits = integers.padStart(integer_count, '0').padEnd(integer_count + fractions_count, '0');
   return new BN(bits, 2);
  }
}


/**
 * Our fixed point numbers go until I64F64, which means that both, the decimal and the fractional part may bey > 53 bits.
 * So we can't just parse the whole number with `parseInt` as we would get an overflow.
 *
 * @param num
 */
const safeRadix10ToRadix2 = function(num: string): string {
  let bin = '';

  for (let digit of num) {
    bin.concat(parseInt(digit, 10).toString(2))
  }

  return bin
}
