import type {EnclaveFingerprint, IntegriteeAssetId, ShardIdentifier} from "@encointer/types";
import type {TypeRegistry} from "@polkadot/types";
import type {AssetIdStr, MrenclaveArg, ShardIdentifierArg} from "@encointer/worker-api";
import bs58 from "bs58";

export function assetIdFromString(assetId: AssetIdStr, registry: TypeRegistry): IntegriteeAssetId {
    // The values below correspond to the enum indexes.
    switch (assetId) {
        case "USDT":
        case "usdt":
            return registry.createType("IntegriteeAssetId", 10);
        case "USDT.e":
        case "usdt.e":
            return registry.createType("IntegriteeAssetId", 11);
        case "USDC":
        case "usdc":
            return registry.createType("IntegriteeAssetId", 20);
        case "USDC.e":
        case "usdc.e":
            return registry.createType("IntegriteeAssetId", 21);
        case "EURC.e":
        case "eurc.e":
            return registry.createType("IntegriteeAssetId", 23);
        case "ETH":
        case "eth":
            return registry.createType("IntegriteeAssetId", 30);
        case "WETH":
        case "weth":
            return registry.createType("IntegriteeAssetId", 31);
        case "BTC":
        case "btc":
            return registry.createType("IntegriteeAssetId", 36);
        case "WBTC.e":
        case "wbtc.e":
            return registry.createType("IntegriteeAssetId", 37);
        default:
            throw new Error("Unknown asset id");
    }

}

export function shardIdentifierFromArg(shard: ShardIdentifierArg, registry: TypeRegistry): ShardIdentifier {
     if (typeof shard === "string") {
       return registry.createType('ShardIdentifier', bs58.decode(shard));
     } else {
         return shard as ShardIdentifier
     }
}

export function enclaveFingerprintFromArg(fingerprint: MrenclaveArg, registry: TypeRegistry): EnclaveFingerprint {
    if (typeof fingerprint === "string") {
        return registry.createType('EnclaveFingerprint', bs58.decode(fingerprint));
    } else {
        return fingerprint as EnclaveFingerprint
    }
}

