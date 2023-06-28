"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
const tslib_1 = require("tslib");
const index_js_1 = tslib_1.__importDefault(require("@encointer/types/index.js"));
function options(opts = {}) {
    const { types = {}, rpc = {}, typesAlias = {}, typesBundle = {} } = opts;
    return {
        types: {
            ...index_js_1.default.types,
            ...types
        },
        rpc: {
            ...index_js_1.default.rpcs,
            ...rpc,
        },
        typesAlias,
        typesBundle
    };
}
exports.options = options;
