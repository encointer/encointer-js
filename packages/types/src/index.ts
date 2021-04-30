import * as encointerDefs from './interfaces/definitions';

function typesFromDefs(
  definitions: Record<string, { types: Record<string, any> }>,
  initTypes: Record<string, any> = {}
): Record<string, any> {
  return Object.values(definitions).reduce(
    (res: Record<string, any>, { types }): Record<string, any> => ({
      ...res,
      ...types
    }),
    initTypes
  );
}

function rpcsFromDefs(
    definitions: Record<string, { rpc: Record<string, any> }>,
    initRpcs: Record<string, any> = {}
): Record<string, any> {
    return Object.values(definitions).reduce(
        (res: Record<string, any>, { rpc }): Record<string, any> => ({
            ...res,
            ...rpc
        }),
        initRpcs
    );
}

export * from './interfaces/index';

const encointer = {
    rpcs: rpcsFromDefs(encointerDefs),
    types: typesFromDefs(encointerDefs),
}

export default encointer;
export { createType } from '@polkadot/types';
