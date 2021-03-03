import {ApiOptions} from '@polkadot/api/types';

import encointerTypes from '@encointer/types';

export function options (opts: ApiOptions = {}): ApiOptions {
  const {
    types = {},
    rpc = {},
    typesAlias = {},
    typesBundle = {}
  } = opts;
  return {
    types: {
      ...encointerTypes,
      ...types
    },
    rpc,
    typesAlias,
    typesBundle
  } as ApiOptions;
}
