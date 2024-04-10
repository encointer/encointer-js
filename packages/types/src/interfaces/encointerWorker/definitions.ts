export default {
  rpc: {},
  types: {
    EncointerGetterArgs: '(AccountId, CommunityIdentifier)',
    EncointerPublicGetter: {
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
    EncointerTrustedGetter: {
      _enum: {
        balance: '(AccountId, CommunityIdentifier)',
        participant_index: '(AccountId, CommunityIdentifier)',
        meetup_index: '(AccountId, CommunityIdentifier)',
        attestations: '(AccountId, CommunityIdentifier)',
        meetup_registry: '(AccountId, CommunityIdentifier)'
      }
    },
    EncointerTrustedGetterSigned: {
      getter: 'EncointerTrustedGetter',
      signature: 'Signature'
    },
    EncointerGetter: {
      _enum: {
        public: 'EncointerPublicGetter',
        trusted: 'EncointerTrustedGetterSigned'
      }
    },
    EncointerTrustedCallSigned: {
      call: 'EncointerTrustedCall',
      nonce: 'u32',
      signature: 'Signature'
    },
    EncointerTrustedCall: {
      _enum: {
        balance_transfer: 'EncointerBalanceTransferArgs',
        ceremonies_register_participant: 'RegisterParticipantArgs',
        ceremonies_register_attestations: 'RegisterAttestationsArgs',
        ceremonies_grant_reputation: 'GrantReputationArgs'
      }
    },
    EncointerBalanceTransferArgs: '(AccountId, AccountId, CommunityIdentifier, BalanceType)',
    RegisterParticipantArgs: '(AccountId, CommunityIdentifier, Option<ProofOfAttendance<MultiSignature, AccountId>>)',
    RegisterAttestationsArgs: '(AccountId, Vec<Attestation<MultiSignature, AccountId, u64>>)',
    GrantReputationArgs: '(AccountId, CommunityIdentifier, AccountId)'
  }
}
