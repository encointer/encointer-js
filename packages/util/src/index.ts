import {ToFixPointFn, toFixPoint, stringToFixPoint, StringToFixPointFn} from './toFixPoint';
import {ParserFixPointFn, parserFixPoint} from './parserFixPoint';

export * from './cidUtil';
export * from './toFixPoint';
export * from './parserFixPoint';

export const parseI4F4: ParserFixPointFn = parserFixPoint(4, 4);

export const parseI8F8: ParserFixPointFn = parserFixPoint(8, 8);

export const parseI16F16: ParserFixPointFn = parserFixPoint(16, 16);

export const parseI32F32: ParserFixPointFn = parserFixPoint(32, 32);

export const parseI64F64: ParserFixPointFn = parserFixPoint(64, 64);

export const toI4F4: ToFixPointFn = toFixPoint(4, 4);

export const toI8F8: ToFixPointFn = toFixPoint(8, 8);

export const toI16F16: ToFixPointFn = toFixPoint(16, 16);

export const toI32F32: ToFixPointFn = toFixPoint(32, 32);

export const toI64F64: ToFixPointFn = toFixPoint(64, 64);

export const stringToI4F4: StringToFixPointFn = stringToFixPoint(4, 4);

export const stringToI8F8: StringToFixPointFn = stringToFixPoint(8, 8);

export const stringToI16F16: StringToFixPointFn = stringToFixPoint(16, 16);

export const stringToI32F32: StringToFixPointFn = stringToFixPoint(32, 32);

export const stringToI64F64: StringToFixPointFn = stringToFixPoint(64, 64);
