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
import {useApi} from '@encointer/node-api';
import {useWorker} from '@encointer/worker-api';

const api = useApi({
  url: 'wss://encointer-node.tld',
  types: {
    /// additional types
  }
});

const worker = useWorker(api, 'wss://worker.encointer-worker.tld');

const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

const balance = worker.getBalance(bob, '3LjCHdiNbNLKEtwGtBf6qHGZnfKFyjLu9v3uxVgDL35C');
```