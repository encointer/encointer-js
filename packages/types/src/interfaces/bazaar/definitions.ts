export default {
    rpc: {},
    types: {
        BusinessIdentifier: {
            communityIdentifier: 'CommunityIdentifier',
            controller: 'AccountId'
        },
        OfferingIdentifier: 'u32',
        Business: {
            controller: 'AccountId',
            business_data: 'BusinessData'
        },
        BusinessData: {
            url: 'PalletString',
            last_oid: 'u32'
        },
        OfferingData: {
            url: 'PalletString'
        }
    }
}
