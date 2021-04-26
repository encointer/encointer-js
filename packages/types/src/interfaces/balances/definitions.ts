export default {
  rpc: {},
  types: {
    BalanceType: 'i128',
    BalanceEntry: {
      principal: 'BalanceType',
      last_update: 'BlockNumber'
    },
    Demurrage: 'BalanceType',
  }
};
