import { u8aToU8a } from "@polkadot/util";
import { base58Decode, base58Encode } from '@polkadot/util-crypto/base58';
/***
 * Helper method to parse a string-formatted `CommunityIdentifier`.
 * @param registry
 * @param cid
 */
export function communityIdentifierFromString(registry, cid) {
    return registry.createType('CommunityIdentifier', {
        geohash: registry.createType('GeoHash', u8aToU8a(cid.substring(0, 5))),
        digest: registry.createType('CidDigest', base58Decode(cid.substring(5))),
    });
}
/***
 * String-format the `CommunityIdentifier` the same way as in rust.
 * @param cid
 */
export function communityIdentifierToString(cid) {
    return cid.geohash.toUtf8() + base58Encode(cid.digest);
}
