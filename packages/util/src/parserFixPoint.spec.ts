'use strict';

import {parseI16F16, parseI32F32, parseI64F64, stringToI64F64} from './index.js';

import BN from 'bn.js';

describe('parserFixPoint', () => {
  it('should parse 0x0', () => {
    const result = parseI16F16(new BN(0x0));
    expect(result).toEqual(0);
  });
  it('should parse 1', () => {
    const result = parseI16F16(new BN(0x10000));
    expect(result).toEqual(1);
  });
  it('should parse 1', () => {
    const result = parseI32F32(new BN(0x128b260000), 18);
    expect(result).toEqual(18.543548583984375);
  });

  it('should parse I64F64', async () => {
    // js representation (using "negative" field on BN)
    expect(parseI64F64(stringToI64F64('-18.1234'))).toEqual(-18.1234);
    expect(parseI64F64(stringToI64F64('18.1234'))).toEqual(18.1234);
    expect(parseI64F64(stringToI64F64('0'))).toEqual(0);
    expect(parseI64F64(stringToI64F64('-0'))).toEqual(0);

    // substrate representation (using twos complement)
    expect(parseI64F64(new BN("00000000000000121F972474538F0000", 'hex', 'be'))).toEqual(18.1234);
    expect(parseI64F64(new BN("FFFFFFFFFFFFFFEDE068DB8BAC710000", 'hex', 'be'))).toEqual(-18.1234);
    expect(parseI64F64(new BN("00000000000000000000000000000000", 'hex', 'be'))).toEqual(0);
  });

});