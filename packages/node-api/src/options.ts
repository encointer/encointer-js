import {ApiOptions} from '@polkadot/api/types';

import encointerTypes from '@encointer/types';

export function options ({
  types = {},
  rpc = {},
  typesAlias = {},
  typesBundle = {},
  ...otherOptions
}: ApiOptions = {}): ApiOptions {
  return {
    types: {
      ...encointerTypes,
      ...types
    }
  };
}
