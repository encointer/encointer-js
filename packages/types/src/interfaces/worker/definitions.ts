export default {
  rpc: {},
  types: {
    ShardIdentifier: 'Hash',
    GetterArgs: '(AccountId, CurrencyIdentifier)',
    Enclave: {
      pubkey: 'AccountId',
      mrenclave: 'Hash',
      timestamp: 'u64',
      url: 'Text'
    },
    PublicGetter: {
      _enum: {
        total_issuance: 'CurrencyIdentifier',
        participant_count: 'CurrencyIdentifier',
        meetup_count: 'CurrencyIdentifier',
        ceremony_reward: 'CurrencyIdentifier',
        location_tolerance: 'CurrencyIdentifier',
        time_tolerance: 'CurrencyIdentifier',
        scheduler_state: 'CurrencyIdentifier'
      }
    },
    TrustedGetter: {
      _enum: {
        balance: '(AccountId, CurrencyIdentifier)',
        participant_index: '(AccountId, CurrencyIdentifier)',
        meetup_index: '(AccountId, CurrencyIdentifier)',
        attestations: '(AccountId, CurrencyIdentifier)',
        meetup_registry: '(AccountId, CurrencyIdentifier)'
      }
    },
    TrustedGetterSigned: {
      getter: 'TrustedGetter',
      signature: 'Signature'
    },
    Getter: {
      _enum: {
        public: 'PublicGetter',
        trusted: 'TrustedGetterSigned'
      }
    },
    ClientRequest: {
      _enum: {
        PubKeyWorker: null,
        MuRaPortWorker: null,
        StfState: '(Getter, ShardIdentifier)'
      }
    },
    WorkerEncoded: 'Vec<u8>',
    Request: {
      shard: 'ShardIdentifier',
      cyphertext: 'WorkerEncoded'
    }
  }
}
