import * as encointerDefs from './interfaces/definitions.js';
function typesFromDefs(definitions, initTypes = {}) {
    return Object.values(definitions).reduce((res, { types }) => ({
        ...res,
        ...types
    }), initTypes);
}
function rpcsFromDefs(definitions, initRpcs = {}) {
    return Object.values(definitions).reduce((res, { rpc }) => ({
        ...res,
        ...rpc
    }), initRpcs);
}
export * from './interfaces/index.js';
const userDefs = {
    ...encointerDefs
};
const encointer = {
    rpcs: rpcsFromDefs(userDefs),
    types: typesFromDefs(encointerDefs),
};
export default encointer;
export { createType } from '@polkadot/types';
import { parseI64F64, stringToI64F64, toI64F64 } from "@encointer/util/index.js";
/**
 * Converts a JS number to a fixed-point BN
 */
export const toEncointerBalance = toI64F64;
/**
 * Converts a fixed-point string representation to a fixed-point BN
 */
export const stringToEncointerBalance = stringToI64F64;
/**
 * Parse encointer balance from a fixed-point BN to a JS number
 */
export const parseEncointerBalance = parseI64F64;
/**
 * Converts a JS number to a fixed-point BN
 */
export const toDegree = toI64F64;
/**
 * Converts a fixed-point string representation to a fixed-point BN
 */
export const stringToDegree = stringToI64F64;
/**
 * Parse a fixed-point BN to a JS number
 */
export const parseDegree = parseI64F64;