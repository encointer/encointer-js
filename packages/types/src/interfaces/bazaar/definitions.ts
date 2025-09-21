export default {
    rpc: {},
    types: {
        BusinessIdentifier: {
            communityIdentifier: 'CommunityIdentifier',
            controller: 'AccountId'
        },
        Business: {
            controller: 'AccountId',
            businessData: 'BusinessData',
        },
        BusinessData: {
            url: 'Text',
            lastOid: 'u32'
        },
        OfferingIdentifier: 'u32',
        OfferingData: {
            url: 'Text'
        }
    }
}
