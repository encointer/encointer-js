import assert from "assert";
import { assertLength } from "./common.js";
export const parserFixPoint = function (upper, lower) {
    const len = assertLength(upper, lower);
    return (raw, precision = lower) => {
        assert(raw.bitLength() <= len, "Bit length is not equal to " + len);
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
