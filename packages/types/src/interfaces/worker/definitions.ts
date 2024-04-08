export default {
  rpc: {},
  types: {
    ShardIdentifier: 'Hash',
    GetterArgs: '(AccountId, CommunityIdentifier)',
    Enclave: {
      pubkey: 'AccountId',
      mrenclave: 'Hash',
      timestamp: 'u64',
      url: 'Text'
    },
    PublicGetter: {
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
    TrustedGetter: {
      _enum: {
        free_balance: 'AccountId',
        reserved_balance: 'AccountId',
        nonce: 'AccountId',
      }
    },
    TrustedGetterSigned: {
      getter: 'TrustedGetter',
      signature: 'MultiSignature'
    },
    Getter: {
      _enum: {
        public: 'PublicGetter',
        trusted: 'TrustedGetterSigned'
      }
    },
    RpcReturnValue: {
      value: 'Vec<u8>',
      do_watch: 'bool',
      status: 'DirectRequestStatus'
    },
    DirectRequestStatus: {
      _enum: {
        Ok: null,
        TrustedOperationStatus: 'TrustedOperationStatus',
        Error: null
      }
    },
    TrustedOperationStatus: {
      _enum: {
        Submitted: null,
        Future: null,
        Ready: null,
        BroadCast: null,
        InSidechainBlock: 'Hash',
        Retracted: null,
        FinalityTimeout: null,
        Finalized: null,
        Usurped: null,
        Dropped: null,
        Invalid: null
      }
    },
    WorkerEncoded: 'Vec<u8>',
    Request: {
      shard: 'ShardIdentifier',
      cyphertext: 'WorkerEncoded'
    },
    TrustedOperation: {
      _enum: {
        indirect_call: 'TrustedCallSigned',
        direct_call: 'TrustedCallSigned',
        get: 'Getter'
      }
    },
    TrustedCallSigned: {
      call: 'TrustedCall',
      nonce: 'u32',
      signature: 'MultiSignature'
    },
    TrustedCall: {
      _enum: {
        noop: 'AccountId',
        balance_set_balance: 'BalanceSetBalanceArgs',
        balance_transfer: 'BalanceTransferArgs',
        balance_unshield: 'BalanceUnshieldArgs',
        balance_shield: 'BalanceShieldArgs',
        timestamp_set: 'TimestampSetArgs',
      }
    },
    Vault: '(AccountId, ParentchainId)',
    ParentchainId: {
      _enum: {
        Integritee: null,
        TargetA: null,
        TargetB: null,
      }
    },
    BalanceSetBalanceArgs: '(AccountId, AccountId, BalanceType, BalanceType)',
    BalanceTransferArgs: '(AccountId, AccountId, BalanceType)',
    BalanceUnshieldArgs: '(AccountId, AccountId, BalanceType, ShardIdentifier)',
    BalanceShieldArgs: '(AccountId, AccountId, BalanceType, ParentchainId)',
    TimestampSetArgs: '(AccountId, H160, BalanceType)',
  }
}
