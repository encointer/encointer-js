"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {},
    types: {
        BalanceType: 'i128',
        BalanceEntry: {
            principal: 'BalanceType',
            lastUpdate: 'BlockNumber'
        },
        Demurrage: 'BalanceType',
    }
};
