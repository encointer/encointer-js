export default {
  rpc: {},
  types: {
    IntegriteePublicGetter: {
      _enum: {
        total_issuance: 'CommunityIdentifier',
        participant_count: 'CommunityIdentifier',
        meetup_count: 'CommunityIdentifier',
        ceremony_reward: 'CommunityIdentifier',
        location_tolerance: 'CommunityIdentifier',
        time_tolerance: 'CommunityIdentifier',
        scheduler_state: 'CommunityIdentifier'
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
        balance_set_balance: 'BalanceSetBalanceArgs',
        balance_transfer: 'BalanceTransferArgs',
        balance_unshield: 'BalanceUnshieldArgs',
        balance_shield: 'BalanceShieldArgs',
        timestamp_set: 'TimestampSetArgs',
      }
    },
    BalanceSetBalanceArgs: '(AccountId, AccountId, BalanceType, BalanceType)',
    BalanceTransferArgs: '(AccountId, AccountId, BalanceType)',
    BalanceUnshieldArgs: '(AccountId, AccountId, BalanceType, ShardIdentifier)',
    BalanceShieldArgs: '(AccountId, AccountId, BalanceType, ParentchainId)',
    TimestampSetArgs: '(AccountId, H160, BalanceType)',
  }
}
