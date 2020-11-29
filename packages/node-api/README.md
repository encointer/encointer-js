# `@encointer/node-api`

Encointer Node API definitions

## Usage

```js
import {ApiPromise} from '@polkadot/api';
import {WsProvider} from '@polkadot/rpc-provider';
import {options} from '@encointer/node-api';

const api = await ApiPromise(options, {
  provider: new WsProvider('wss://cantillon.encointer.org');
});
```
