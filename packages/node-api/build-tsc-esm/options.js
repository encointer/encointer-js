import encointer from '@encointer/types/index.js';
export function options(opts = {}) {
    const { types = {}, rpc = {}, typesAlias = {}, typesBundle = {} } = opts;
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
    };
}
