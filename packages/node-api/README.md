# @encointer/node-api

Encointer Node API definitions

## Installation

```
yarn add @encointer/node-api @encointer/worker-api
```

## Usage

```js
import { ApiPromise } from '@polkadot/api';
import { WsProvider} from '@polkadot/rpc-provider';
import { options } from '@encointer/node-api';

// Connect to Encointer Cantillon
const api = await ApiPromise({
  options(),
  provider: new WsProvider('wss://cantillon.encointer.org')
});
```
