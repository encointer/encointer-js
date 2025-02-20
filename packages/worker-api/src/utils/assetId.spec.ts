import {TypeRegistry} from "@polkadot/types";
import {options as encointerOptions} from '@encointer/node-api';
import type {RegistryTypes} from "@polkadot/types/types";
import {assetIdFromString} from "@encointer/worker-api/utils/assetId.js";

describe('worker', () => {
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
    })
});
