export default {
    rpc: {},
    types: {
        BusinessIdentifier: {
            communityIdentifier: 'CommunityIdentifier',
            controller: 'AccountId'
        },
        Business: {
            controller: 'AccountId',
            business_data: 'BusinessData',
        },
        BusinessData: {
            url: 'PalletString',
            last_oid: 'u32'
        },
        OfferingIdentifier: 'u32',
        OfferingData: {
            url: 'PalletString'
        }
    }
}
