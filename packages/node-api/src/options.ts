import {ApiOptions} from '@polkadot/api/types';

import encointer from '@encointer/types';

export function options (opts: ApiOptions = {}): ApiOptions {
  const {
    types = {},
    rpc = {},
    typesAlias = {},
    typesBundle = {}
  } = opts;
  return {
    types: {
      ...encointer.types,
      ...types
    },
    rpc: {
      ...encointer.rpcs,
      ...rpc,
    },
    typesAlias,
    typesBundle
  } as ApiOptions;
}
