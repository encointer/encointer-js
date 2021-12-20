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
    let [integers, fractions] = num.split('.');

    integers = safeIntegerToRadix2(integers);

    if (fractions != undefined) {
      fractions = fractionalToRadix2(fractions);
    }

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
 * @param num Integer number with base 10 radix
 */
export const fractionalToRadix2 = function(num: string): string {
  return parseFloat('0.' + num).toString(2)
      .split('.')[1];
}
