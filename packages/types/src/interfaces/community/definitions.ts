export default {
  rpc: {},
  types: {
    CommunityIdentifier: 'Hash',
    BalanceType: 'i128',
    BalanceEntry: {
      principal: 'i128',
      last_update: 'BlockNumber'
    },
    CommunityCeremony: '(CommunityIdentifier,CeremonyIndexType)',
    CommunityPropertiesType: {
      name_utf8: 'Vec<u8>',
      demurrage_per_block: 'Demurrage'
    },
    Demurrage: 'i128',
    Reputation: {
      _enum: [
        'Unverified',
        'UnverifiedReputable',
        'VerifiedUnlinked',
        'VerifiedLinked'
      ]
    }
  }
};
