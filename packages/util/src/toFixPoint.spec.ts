'use strict';

import {
  stringToI16F16,
  stringToI64F64,
  toI16F16,
  toI32F32,
} from './index.js';

import BN from 'bn.js';

describe('toFixPoint', () => {
  it('should parse integer to fixPoint', async () => {
    const result = toI16F16(1);
    expect(result).toEqual(new BN(0x10000, 2));
  });
  it('should parse 0 to fixPoint', async () => {
    const result = toI16F16(0);
    expect(result).toEqual(new BN(0x0, 2));
  });
  it('should parse 1.1 to fixPoint', async () => {
    const result = toI16F16(1.1);
    expect(result).toEqual(new BN(0x011999));
  });

  it('should parse 18 to fixPoint', async () => {
    const result = toI16F16(18);
    expect(result).toEqual(new BN(0x0120000));
  });


  it('should parse location to fixPoint', async () => {
    const location = { lat: 35.48415638, lon: 18.543548584 };
    const resultLat = toI32F32(location.lat);
    expect(resultLat).toEqual(new BN(0x237bf1ac2a));
    const resultLon = toI32F32(location.lon);
    expect(resultLon).toEqual(new BN(0x128b260000));
  });
});


describe('stringToFixPoint', () => {
  it('should parse integer to fixPoint', async () => {
    const result = stringToI16F16('1');
    expect(result).toEqual(new BN(0x10000, 2));
  });

  it('should parse 0 to fixPoint', async () => {
    const result = stringToI16F16('0');
    expect(result).toEqual(new BN(0x0, 2));
  });

  it('should parse 1.1 to fixPoint', async () => {
    const result = stringToI16F16('1.1');
    expect(result).toEqual(new BN(0x011999));
  });

  it('should parse 18.1 to fixPoint', async () => {
    const result = stringToI16F16('18.1');
    expect(result).toEqual(new BN(0x0121999));
  });

  it('should parse problematic fixed point number', async () => {
    // This errored pre 0.5.0-alpha.5 due to being truncated as it was > 53 bytes
    const result = stringToI64F64('18.4062194824218714473');

    // need to pass big values as a hex-string as JS can't handle the number.
    expect(result).toEqual(new BN('1267fdffffffff0000', 16));
  });

  it('returns 0 on too small number', async () => {
    const result = stringToI64F64('0.000000000000000000000000000000000000001');

    expect(result).toEqual(new BN('0', 16));
  });
});
