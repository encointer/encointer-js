export default {
    rpc: {
        encointer: {
            bazaarGetBusinesses: {
                description: 'Get all businesses in a Community',
                params: [
                    {
                        name: 'cid',
                        type: 'CommunityIdentifier',
                        isOptional: false
                    },
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Vec<BusinessData>'
            },
            bazaarGetOfferings: {
                description: 'Get all offerings in a Community',
                params: [
                    {
                        name: 'cid',
                        type: 'CommunityIdentifier',
                        isOptional: false
                    },
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Vec<OfferingData>'
            },
            bazaarGetOfferingsForBusiness: {
                description: 'Get all offerings of a business',
                params: [
                    {
                        name: 'bid',
                        type: 'BusinessIdentifier',
                        isOptional: false
                    },
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Vec<OfferingData>'
            }
        }
    },
    types: {
        BusinessIdentifier: {
            communityIdentifier: 'CommunityIdentifier',
            controller: 'AccountId'
        },
        OfferingIdentifier: 'u32',
        BusinessData: {
            url: 'PalletString',
            last_oid: 'u32'
        },
        OfferingData: {
            url: 'PalletString'
        }
    }
}
