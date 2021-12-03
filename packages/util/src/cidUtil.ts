import {CommunityIdentifier} from "@encointer/types";
import { u8aToU8a} from "@polkadot/util";
import { base58Decode } from '@polkadot/util-crypto/base58';
import {TypeRegistry} from "@polkadot/types";

/***
 * Helper method to parse a string-formatted `CommunityIdentifier`.
 * @param registry
 * @param cid
 */
export function communityIdentifierFromString(registry: TypeRegistry, cid: String): CommunityIdentifier {
    return registry.createType('CommunityIdentifier', {
        geo_hash: registry.createType('GeoHash', u8aToU8a(cid.substring(0,5))),
        digest: registry.createType('CidDigest', base58Decode(cid.substring(5))),
    });
}
