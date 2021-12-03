'use strict';

import {communityIdentifierFromString} from ".";
import {TypeRegistry} from "@polkadot/types";
import {options as encointerOptions} from "@encointer/node-api";
import {RegistryTypes} from "@polkadot/types/types";

describe('encodeFloatToFixPoint', () => {
    it('should encode integer to fixPoint', () => {
        const cidStr = "gbsuv7YXq9G";

        // scale-encoded `CommunityIdentifier` generated in rust.
        const cid = new Uint8Array([103, 98, 115, 117, 118, 255, 255, 255, 255]);

        const registry = new TypeRegistry()
        registry.register(encointerOptions().types as RegistryTypes)

        expect(
            communityIdentifierFromString(registry, cidStr).toU8a(),
        ).toStrictEqual(cid);
    });
});
