"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToFixPoint = exports.toFixPoint = void 0;
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
const common_js_1 = require("./common.js");
const toFixPoint = function (upper, lower) {
    (0, common_js_1.assertLength)(upper, lower);
    return (num) => {
        const [upperBits, lowerBits] = num.toString(2).split('.');
        return toFixed(upperBits, lowerBits, upper, lower);
    };
};
exports.toFixPoint = toFixPoint;
const stringToFixPoint = function (upper, lower) {
    (0, common_js_1.assertLength)(upper, lower);
    return (num) => {
        let [integers, fractions] = num.split('.');
        integers = (0, common_js_1.safeIntegerToRadix2)(integers);
        if (fractions != undefined) {
            fractions = (0, common_js_1.fractionalToRadix2)(fractions);
        }
        return toFixed(integers, fractions, upper, lower);
    };
};
exports.stringToFixPoint = stringToFixPoint;
/**
 * Creates a fixed-point number representation.
 *
 * @param integers integer bits as string with radix 2.
 * @param fractions fractional bits as string with radix 2.
 * @param integer_count amount of integer bits in the fixed-point type.
 * @param fractions_count amount of fractional bits in the fixed-point type.
 */
const toFixed = function (integers, fractions, integer_count, fractions_count) {
    (0, common_js_1.assertLength)(integer_count, fractions_count);
    (0, assert_1.default)(integers.length <= integer_count, 'Number is larger than maximum in '.concat(integer_count.toString(), 'bit'));
    if (fractions !== undefined) {
        const bits = integers.concat(fractions.length > fractions_count ? fractions.substring(0, fractions_count) : fractions.padEnd(fractions_count, '0'));
        return new bn_js_1.default(bits, 2);
    }
    else {
        const bits = integers.padStart(integer_count, '0').padEnd(integer_count + fractions_count, '0');
        return new bn_js_1.default(bits, 2);
    }
};
