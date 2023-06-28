export default {
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
