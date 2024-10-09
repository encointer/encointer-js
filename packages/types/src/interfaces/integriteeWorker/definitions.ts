export default {
  rpc: {},
  types: {
    IntegriteePublicGetter: {
      _enum: {
        guess_the_number_last_lucky_number: null,
        guess_the_number_last_winning_distance: null,
        guess_the_number_info: null,
      }
    },
    IntegriteeTrustedGetter: {
      _enum: {
        account_info: 'AccountId',
      }
    },
    IntegriteeTrustedGetterSigned: {
      getter: 'IntegriteeTrustedGetter',
      signature: 'MultiSignature'
    },
    IntegriteeGetter: {
      _enum: {
        public: 'IntegriteePublicGetter',
        trusted: 'IntegriteeTrustedGetterSigned'
      }
    },
    IntegriteeTrustedOperation: {
      _enum: {
        indirect_call: 'IntegriteeTrustedCallSigned',
        direct_call: 'IntegriteeTrustedCallSigned',
        get: 'IntegriteeGetter'
      }
    },
    IntegriteeTrustedCallSigned: {
      call: 'IntegriteeTrustedCall',
      nonce: 'u32',
      signature: 'MultiSignature'
    },
    IntegriteeTrustedCall: {
      _enum: {
        noop: 'AccountId',
        timestamp_set: 'TimestampSetArgs',
        balance_transfer: 'BalanceTransferArgs',
        balance_unshield: 'BalanceUnshieldArgs',
        balance_shield: 'BalanceShieldArgs',
        guess_the_number_set_winnings: 'GuessTheNumberSetWinningsArgs',
        guess_the_number_push_by_one_day: 'AccountId',
        guess_the_number: 'GuessTheNumberArgs',
        balance_set_balance: 'BalanceSetBalanceArgs',
      }
    },
    GuessType: 'u32',
    GuessTheNumberSetWinningsArgs: '(AccountId, Balance)',
    GuessTheNumberArgs: '(AccountId, GuessType)',
    TimestampSetArgs: '(AccountId, H160, BalanceType)',
    BalanceTransferArgs: '(AccountId, AccountId, BalanceType)',
    BalanceShieldArgs: '(AccountId, AccountId, BalanceType, ParentchainId)',
    BalanceUnshieldArgs: '(AccountId, AccountId, BalanceType, ShardIdentifier)',
    BalanceSetBalanceArgs: '(AccountId, AccountId, BalanceType, BalanceType)',
  }
}
