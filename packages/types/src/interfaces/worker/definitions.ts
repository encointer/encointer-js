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
      signature: 'Signature'
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
    TrustedCallSigned: {
      call: 'TrustedCall',
      nonce: 'u32',
      signature: 'Signature'
    },
    TrustedCall: {
      _enum: {
        balance_transfer: 'BalanceTransferArgs',
        ceremonies_register_participant: 'RegisterParticipantArgs',
        ceremonies_register_attestations: 'RegisterAttestationsArgs',
        ceremonies_grant_reputation: 'GrantReputationArgs'
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
    BalanceTransferArgs: '(AccountId, AccountId, CommunityIdentifier, BalanceType)',
    RegisterParticipantArgs: '(AccountId, CommunityIdentifier, Option<ProofOfAttendance<MultiSignature, AccountId>>)',
    RegisterAttestationsArgs: '(AccountId, Vec<Attestation<MultiSignature, AccountId, u64>>)',
    GrantReputationArgs: '(AccountId, CommunityIdentifier, AccountId)'
  }
}
