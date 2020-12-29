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

export * from './interfaces/index';
const encointerTypes = typesFromDefs(encointerDefs);
export default encointerTypes;
export { createType } from '@polkadot/types';
