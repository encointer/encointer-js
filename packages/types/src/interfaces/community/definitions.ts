export default {
  rpc: {
    communities: {
      getAll: {
        description: 'Get the name of all communities as Vec<CidNames>',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<CidName>'
      }
    }
  },
  types: {
    CommunityIdentifier: {
      geohash: 'GeoHash',
      digest: 'CidDigest'
    },
    GeoHash: '[u8; 5]',
    // We need to call it `CidDigest` because plain `Digest` is already a substrate type.
    CidDigest: '[u8; 4]',
    CommunityCeremony: '(CommunityIdentifier,CeremonyIndexType)',
    NominalIncomeType: 'BalanceType',
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
    CidName: {
      cid: 'CommunityIdentifier',
      name: 'Text',
    },
    CommunityMetadataType: {
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
