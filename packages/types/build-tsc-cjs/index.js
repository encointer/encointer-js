"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDegree = exports.stringToDegree = exports.toDegree = exports.parseEncointerBalance = exports.stringToEncointerBalance = exports.toEncointerBalance = exports.createType = void 0;
const tslib_1 = require("tslib");
const encointerDefs = tslib_1.__importStar(require("./interfaces/definitions.js"));
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
tslib_1.__exportStar(require("./interfaces/index.js"), exports);
const userDefs = {
    ...encointerDefs
};
const encointer = {
    rpcs: rpcsFromDefs(userDefs),
    types: typesFromDefs(encointerDefs),
};
exports.default = encointer;
var types_1 = require("@polkadot/types");
Object.defineProperty(exports, "createType", { enumerable: true, get: function () { return types_1.createType; } });
const index_js_1 = require("@encointer/util/index.js");
/**
 * Converts a JS number to a fixed-point BN
 */
exports.toEncointerBalance = index_js_1.toI64F64;
/**
 * Converts a fixed-point string representation to a fixed-point BN
 */
exports.stringToEncointerBalance = index_js_1.stringToI64F64;
/**
 * Parse encointer balance from a fixed-point BN to a JS number
 */
exports.parseEncointerBalance = index_js_1.parseI64F64;
/**
 * Converts a JS number to a fixed-point BN
 */
exports.toDegree = index_js_1.toI64F64;
/**
 * Converts a fixed-point string representation to a fixed-point BN
 */
exports.stringToDegree = index_js_1.stringToI64F64;
/**
 * Parse a fixed-point BN to a JS number
 */
exports.parseDegree = index_js_1.parseI64F64;
