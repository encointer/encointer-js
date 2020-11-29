# Encointer JS

Encointer JavaScript API monorepo

# Contains

- [@encointer/node-api](packages/node-api/) The Node API
- [@encointer/worker-api](packages/worker-api/) The Worker API
- [@encointer/util](packages/util/) utilities to work with Encointer specific data

# Installation

```js
yarn add @encointer/node-api @encointer/worker-api
```

# Usage example

```js
import {ApiPromise} from '@polkadot/api';
import {WsProvider} from '@polkadot/rpc-provider';
import {options} from '@encointer/node-api';
import {useWorker} from '@encointer/worker-api';

const api = await ApiPromise(options, {
  provider: new WsProvider('wss://cantillon.encointer.org');
  types: {
    /// additional types
  }
});

const worker = useWorker(api, 'wss://worker.encointer-worker.tld');

const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

// Query balance from worker
const balance = worker.getBalance(bob, '3LjCHdiNbNLKEtwGtBf6qHGZnfKFyjLu9v3uxVgDL35C');
```