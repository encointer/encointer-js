# Encointer JS

Encointer JavaScript API monorepo

# Contains

- [@encointer/types](packages/types/) Encointer type definitions
- [@encointer/node-api](packages/node-api/) The Node API
- [@encointer/worker-api](packages/worker-api/) The Worker API
- [@encointer/util](packages/util/) utilities to work with Encointer specific data

# Installation

```js
yarn add @encointer/node-api @encointer/worker-api
```

# Usage example

```js
import { EncointerWorker } from '@encointer/worker-api';
import { options } from '@encointer/node-api'

import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

communityId = '3LjCHdiNbNLKEtwGtBf6qHGZnfKFyjLu9v3uxVgDL35C';

/// In async function
// connect to Encointer node
const api = await ApiPromise.create({
    ...options({
        /// additional types
    }),
    provider: new WsProvider(nodeAddr)
});

// Get first worker endpoint from registry
const workerEndpoint = await api.query.substrateeRegistry.enclaveRegistry(1)

// Create worker
const worker = new EncointerWorker(workerEndpoint, { api });

// Get public data from worker
const total = await worker.getTotalIssuance(communityId);

console.log('Total issuance:', total);

const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

// Query balance from worker
const balance = worker.getBalance(bob, communityId);

console.log('Bob owns:', balance);
```