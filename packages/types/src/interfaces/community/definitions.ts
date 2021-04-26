export default {
  rpc: {},
  types: {
    CommunityIdentifier: 'Hash',
    CommunityCeremony: '(CommunityIdentifier,CeremonyIndexType)',
    NominalIncome: 'BalanceType',
    Degree: 'i128',
    Location: {
      lat: 'Degree',
      lon: 'Degree'
    },
    Reputation: {
      _enum: [
        'Unverified',
        'UnverifiedReputable',
        'VerifiedUnlinked',
        'VerifiedLinked'
      ]
    },
    CommunityMetadata: {
      name: 'Text',
      symbol: 'Text',
      icons: 'Text',
      theme: 'Option<Theme>',
      url: 'Option<Text>'
    },
    Theme: {
      primary_swatch: 'u32'
    }
  }
};
