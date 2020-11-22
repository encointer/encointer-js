import assert from 'assert';

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
