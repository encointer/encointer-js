import type { Definitions } from '@polkadot/types/types';

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
} as Definitions;
