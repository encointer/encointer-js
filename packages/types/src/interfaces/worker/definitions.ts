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
    AssetId: {
      _enum: {
        unused_index_0: null,
        unused_index_1: null,
        unused_index_2: null,
        unused_index_3: null,
        unused_index_4: null,
        unused_index_5: null,
        unused_index_6: null,
        unused_index_7: null,
        unused_index_8: null,
        unused_index_9: null,
        USDT: null,
        unused_index_11: null,
        unused_index_12: null,
        unused_index_13: null,
        unused_index_14: null,
        unused_index_15: null,
        unused_index_16: null,
        unused_index_17: null,
        unused_index_18: null,
        unused_index_19: null,
        USDC: null,
        USDC_E: null,
        unused_index_22: null,
        unused_index_23: null,
        unused_index_24: null,
        unused_index_25: null,
        unused_index_26: null,
        unused_index_27: null,
        unused_index_28: null,
        unused_index_29: null,
        ETH: null,
        WETH: null,
      }
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
