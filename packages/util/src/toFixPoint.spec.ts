'use strict';

import {
  safeIntegerToRadix2,
  stringToI16F16,
  stringToI64F64,
  toI16F16,
  toI32F32,
} from '.';

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
    expect(result).toEqual(new BN('121999', 16));
  });

  it('should parse problematic fixed point number', async () => {
    // gave an error pre 0.5.0-alpha.5 being truncated due to > 53 bytes
    const number = '18.4062194824218714473';
    const result = stringToI64F64(number);

    expect(result).toEqual(new BN('1267fdffffffff0000', 16));
  });

  it('returns 0 on too small number', async () => {
    const number = '0.000000000000000000000000000000000000001';
    const result = stringToI64F64(number);

    expect(result).toEqual(new BN('0', 16));
  });
});


describe('safeRadix10ToRadix2', () => {
  it('should transform', async () => {
    const result = safeIntegerToRadix2('8');
    expect(result).toEqual('1000');
  });
});


