"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    rpc: {},
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
        // This is used when handling fixed-point numbers that have been serialized with `serialize_fixed` on rusts end,
        // which is the case when we call any rpc-getters.
        DegreeRpc: 'Text',
        // This is used when we need to encode fixed-point numbers with scale-codec, e.g., when using it in an extrinsic.
        DegreeFixed: 'i128',
        Location: {
            lat: 'DegreeFixed',
            lon: 'DegreeFixed'
        },
        LocationRpc: {
            lat: 'DegreeRpc',
            lon: 'DegreeRpc'
        },
        CidName: {
            cid: 'CommunityIdentifier',
            name: 'Text',
        },
        CommunityMetadataType: {
            name: 'Text',
            symbol: 'Text',
            assets: 'Text',
            theme: 'Option<Text>',
            url: 'Option<Text>'
        },
    }
};
