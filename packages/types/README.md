# @encointer/types

Encointer type definitions for Polkadot.js

## Installation

```
yarn add @encointer/types
```

## Usage

```js
import types from '@encointer/types';
```

## Usage with TypeScript

TODO

## Update types

To update the types, a new definition is added to the `types` map.

```typescript
export default {
  rpc: {},
  types: {
    NewType: '<NewTypeDef>',
  }
};
```

A subsequent `yarn generate:defs` updates the types.

To update the polkadot types, upgrade the `@polkadot/types` package and generate the types again.

The type generation process is elaborated on in the polkadot.{js} [docs](https://polkadot.js.org/docs/api/examples/promise/typegen#types-setup).