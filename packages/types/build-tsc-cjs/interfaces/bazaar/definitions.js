"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {},
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
};
