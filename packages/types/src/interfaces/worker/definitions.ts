export default {
  rpc: {},
  types: {
    ShardIdentifier: 'Hash',
    EnclaveFingerprint: 'H256',
    GetterArgs: '(AccountId, CommunityIdentifier)',
    Enclave: {
      pubkey: 'AccountId',
      mrenclave: 'Hash',
      timestamp: 'u64',
      url: 'Text'
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
    Vault: '(AccountId, ParentchainId)',
    ParentchainId: {
      _enum: {
        Integritee: null,
        TargetA: null,
        TargetB: null,
      }
    },
    ParentchainsInfo: {
      integritee: 'ParentchainInfo',
      target_a: 'ParentchainInfo',
      target_b: 'ParentchainInfo',
      shielding_target: 'ParentchainId',
    },
    ParentchainInfo: {
      id: 'ParentchainId',
      genesis_hash: 'Option<Hash>',
      block_number: 'Option<BlockNumber>',
      now: 'Option<Moment>',
      creation_block_number: 'Option<BlockNumber>',
      creation_timestamp: 'Option<Moment>',
    },
  }
}
