export default {
    rpc: {},
    types: {
        BusinessIdentifier: {
            community_identifier: 'CommunityIdentifier',
            controller: 'bid'
        },
        OfferingIdentifier: 'u32',
        BusinessData: {
            url: 'Text',
            last_oid: 'u32'
        },
        OfferingData: {
            url: 'Text'
        }
    }
}