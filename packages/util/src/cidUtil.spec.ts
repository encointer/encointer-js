'use strict';

import {communityIdentifierFromString, communityIdentifierToString} from ".";
import {TypeRegistry} from "@polkadot/types";
import {options, options as encointerOptions} from "@encointer/node-api";
import {RegistryTypes} from "@polkadot/types/types";

describe('cidUtils', () => {
    const cidStr = "gbsuv7YXq9G";

    // scale-encoded `CommunityIdentifier` generated in rust.
    const cidRaw = new Uint8Array([103, 98, 115, 117, 118, 255, 255, 255, 255]);

    const registry = new TypeRegistry()

    beforeAll(() => {
        registry.register(encointerOptions().types as RegistryTypes)
    });

    it('should parse string-formatted cid', () => {
        expect(
            communityIdentifierFromString(registry, cidStr).toU8a(),
        ).toStrictEqual(cidRaw);
    });

    it('should correctly format CommunityIdentifier', () => {
        const cid = registry.createType('CommunityIdentifier', cidRaw);

        expect(
            communityIdentifierToString(cid)
        ).toStrictEqual(cidStr);
    });
});
