import {TypeRegistry} from "@polkadot/types";
import {options as encointerOptions} from '@encointer/node-api';
import type {RegistryTypes} from "@polkadot/types/types";
import {
    assetIdFromString,
    enclaveFingerprintFromArg,
    shardIdentifierFromArg
} from "@encointer/worker-api/utils/typeUtils.js";
import bs58 from "bs58";

describe('utils', () => {
    let registry: TypeRegistry;
    beforeAll(async () => {
        registry = new TypeRegistry();

        registry.register(encointerOptions().types as RegistryTypes)
    });

    afterAll(async () => {
    });

    describe('Create Asset Id', () => {
        it('USDT works', () => {
            const asset_id = assetIdFromString("USDT", registry);
            expect(asset_id.isUsdt);
        })

        it('usdt works', () => {
            const asset_id = assetIdFromString("usdt", registry);
            expect(asset_id.isUsdt);
        })

        it('USDT.e works', () => {
            const asset_id = assetIdFromString("USDT.e", registry);
            expect(asset_id.isUsdtE);
        })

        it('usdt.e works', () => {
            const asset_id = assetIdFromString("usdt.e", registry);
            expect(asset_id.isUsdtE);
        })

        it('USDC works', () => {
            const asset_id = assetIdFromString("USDC", registry);
            expect(asset_id.isUsdc);
        })

        it('usdc works', () => {
            const asset_id = assetIdFromString("usdc", registry);
            expect(asset_id.isUsdc);
        })

        it('USDC.e works', () => {
            const asset_id = assetIdFromString("USDC.e", registry);
            expect(asset_id.isUsdcE);
        })

        it('usdc.e works', () => {
            const asset_id = assetIdFromString("usdc.e", registry);
            expect(asset_id.isUsdcE);
        })

        it('EURC.e works', () => {
            const asset_id = assetIdFromString("EURC.e", registry);
            expect(asset_id.isEurcE);
        })

        it('eurc.e works', () => {
            const asset_id = assetIdFromString("eurc.e", registry);
            expect(asset_id.isEurcE);
        })

        it('ETH works', () => {
            const asset_id = assetIdFromString("ETH", registry);
            expect(asset_id.isEth);
        })

        it('eth works', () => {
            const asset_id = assetIdFromString("eth", registry);
            expect(asset_id.isEth);
        })

        it('WETH works', () => {
            const asset_id = assetIdFromString("WETH", registry);
            expect(asset_id.isWeth);
        })

        it('weth works', () => {
            const asset_id = assetIdFromString("weth", registry);
            expect(asset_id.isWeth);
        })

        it('BTC works', () => {
            const asset_id = assetIdFromString("BTC", registry);
            expect(asset_id.isBtc);
        })

        it('btc works', () => {
            const asset_id = assetIdFromString("btc", registry);
            expect(asset_id.isBtc);
        })

        it('WBTC.e works', () => {
            const asset_id = assetIdFromString("WBTC.e", registry);
            expect(asset_id.isWbtcE);
        })

        it('wbtc.e works', () => {
            const asset_id = assetIdFromString("wbtc.e", registry);
            expect(asset_id.isWbtcE);
        })
    })

    describe('Create ShardIdentifier', () => {
        it('From String Works', () => {
            const shard = shardIdentifierFromArg("5wePd1LYa5M49ghwgZXs55cepKbJKhj5xfzQGfPeMS7c", registry);
            expect(shard.toHuman()).toBe("IncogniteeTestnet000000000000003");
        })

        it('From Hash Works', () => {
            const hash = registry.createType('Hash', bs58.decode("5wePd1LYa5M49ghwgZXs55cepKbJKhj5xfzQGfPeMS7c"));
            const fingerprint = shardIdentifierFromArg(hash, registry);
            expect(fingerprint.toHuman()).toBe("IncogniteeTestnet000000000000003");
        })

        it('From H256 Works', () => {
            const hash = registry.createType('H256', bs58.decode("5wePd1LYa5M49ghwgZXs55cepKbJKhj5xfzQGfPeMS7c"));
            const fingerprint = shardIdentifierFromArg(hash, registry);
            expect(fingerprint.toHuman()).toBe("IncogniteeTestnet000000000000003");
        })

        it('From ShardIdentifier Works', () => {
            const hash = registry.createType('ShardIdentifier', bs58.decode("5wePd1LYa5M49ghwgZXs55cepKbJKhj5xfzQGfPeMS7c"));
            const fingerprint = shardIdentifierFromArg(hash, registry);
            expect(fingerprint.toHuman()).toBe("IncogniteeTestnet000000000000003");
        })
    });

    describe('Create EnclaveFingerPrint', () => {
        it('From String Works', () => {
            const fingerprint = enclaveFingerprintFromArg("5BUCG8UXdgjWDDFQUd5kuRwnubDnMFhYEdbgxDZTnrBx", registry);
            expect(fingerprint.toHuman()).toBe("0x3e1d4de8123172257f2dbeb9c37a6c0f05ac739bb2c3f29915b31741a8647687");
        })

        it('From Hash Works', () => {
            const hash = registry.createType('Hash', bs58.decode("5BUCG8UXdgjWDDFQUd5kuRwnubDnMFhYEdbgxDZTnrBx"));
            const fingerprint = enclaveFingerprintFromArg(hash, registry);
            expect(fingerprint.toHuman()).toBe("0x3e1d4de8123172257f2dbeb9c37a6c0f05ac739bb2c3f29915b31741a8647687");
        })

        it('From H256 Works', () => {
            const hash = registry.createType('H256', bs58.decode("5BUCG8UXdgjWDDFQUd5kuRwnubDnMFhYEdbgxDZTnrBx"));
            const fingerprint = enclaveFingerprintFromArg(hash, registry);
            expect(fingerprint.toHuman()).toBe("0x3e1d4de8123172257f2dbeb9c37a6c0f05ac739bb2c3f29915b31741a8647687");
        })

        it('From ShardIdentifier Works', () => {
            const hash = registry.createType('ShardIdentifier', bs58.decode("5BUCG8UXdgjWDDFQUd5kuRwnubDnMFhYEdbgxDZTnrBx"));
            const fingerprint = enclaveFingerprintFromArg(hash, registry);
            expect(fingerprint.toHuman()).toBe("0x3e1d4de8123172257f2dbeb9c37a6c0f05ac739bb2c3f29915b31741a8647687");
        })
    });
});
