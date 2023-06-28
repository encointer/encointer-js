"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {
        encointer: {
            getReputations: {
                description: 'Get all reputations of an account in any community',
                params: [
                    {
                        name: 'account',
                        type: 'AccountId',
                        isOptional: false
                    },
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Vec<(CeremonyIndexType, CommunityReputation)>'
            },
            getAllCommunities: {
                description: 'Get the cid and name of all communities as Vec<CidNames>',
                params: [
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Vec<CidName>'
            },
            getLocations: {
                description: 'Get all registered locations of a community',
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
                type: 'Vec<LocationRpc>'
            },
            getAllBalances: {
                description: 'Get all non-zero balances for account in all communities',
                params: [
                    {
                        name: 'account',
                        type: 'AccountId',
                        isOptional: false
                    },
                    {
                        name: 'at',
                        type: 'Hash',
                        isOptional: true
                    }
                ],
                type: 'Vec<(CommunityIdentifier, BalanceEntry)>'
            },
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
        },
    },
    types: {
        PalletString: 'Text',
        IpfsCid: 'Text',
        FixedI64F64: {
            bits: "i128"
        }
    }
};
