import type {IntegriteeAssetId} from "@encointer/types";
import type {TypeRegistry} from "@polkadot/types";


export type AssetIdStr = "USDT" | "usdt" | "USDC" | "usdc" | "USDC.e" | "usdc.e" | "ETH" | "eth" | "WETH" | "weth"

export function assetIdFromString(assetId: AssetIdStr, registry: TypeRegistry): IntegriteeAssetId {
    // The values below correspond to the enum indexes.
    switch (assetId) {
        case "USDT":
        case "usdt":
            return registry.createType("IntegriteeAssetId", 10);
        case "USDC":
        case "usdc":
            return registry.createType("IntegriteeAssetId", 20);
        case "USDC.e":
        case "usdc.e":
            return registry.createType("IntegriteeAssetId", 21);
        case "ETH":
        case "eth":
            return registry.createType("IntegriteeAssetId", 30);
        case "WETH":
        case "weth":
            return registry.createType("IntegriteeAssetId", 31);
        default:
            throw new Error("Unknown asset id");
    }

}
