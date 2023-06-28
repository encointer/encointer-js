"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parserFixPoint = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const common_js_1 = require("./common.js");
const parserFixPoint = function (upper, lower) {
    const len = (0, common_js_1.assertLength)(upper, lower);
    return (raw, precision = lower) => {
        (0, assert_1.default)(raw.bitLength() <= len, "Bit length is not equal to " + len);
        raw = raw.fromTwos(len);
        const bits = raw.toString(2, len);
        const lowerBits = (lower > bits.length ? bits.padStart(lower, "0") : bits).slice(-lower, -1 * (lower - precision) || undefined);
        const floatPart = lowerBits
            .split("")
            .reduce((acc, bit, idx) => {
            acc = acc + (bit === "1" ? 1 / 2 ** (idx + 1) : 0);
            return acc;
        }, 0);
        const upperBits = bits.slice(0, -lower);
        const decimalPart = upperBits ? parseInt(upperBits, 2) : 0;
        return decimalPart + (raw.isNeg() ? -floatPart : floatPart);
    };
};
exports.parserFixPoint = parserFixPoint;
