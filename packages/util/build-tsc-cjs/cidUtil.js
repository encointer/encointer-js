"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityIdentifierToString = exports.communityIdentifierFromString = void 0;
const util_1 = require("@polkadot/util");
const base58_1 = require("@polkadot/util-crypto/base58");
/***
 * Helper method to parse a string-formatted `CommunityIdentifier`.
 * @param registry
 * @param cid
 */
function communityIdentifierFromString(registry, cid) {
    return registry.createType('CommunityIdentifier', {
        geohash: registry.createType('GeoHash', (0, util_1.u8aToU8a)(cid.substring(0, 5))),
        digest: registry.createType('CidDigest', (0, base58_1.base58Decode)(cid.substring(5))),
    });
}
exports.communityIdentifierFromString = communityIdentifierFromString;
/***
 * String-format the `CommunityIdentifier` the same way as in rust.
 * @param cid
 */
function communityIdentifierToString(cid) {
    return cid.geohash.toUtf8() + (0, base58_1.base58Encode)(cid.digest);
}
exports.communityIdentifierToString = communityIdentifierToString;
