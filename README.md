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

# Publish to npm

```
// will prompt you to select version to increase, e.g. major, minor, patch etc. (Creates git tag!)
lerna version --force-publish

// apply changes from package.json to */build/package.json 
yarn build

// publish all changes from the build directory to npm
lerna publish from-package --contents build
```

The lerna commands have been added as scripts to the `package.json`.

**WARN** When the packages are linked in the `js_encointer_service` and yarn install is run, it will create a 
`node_modules` folder inside the build folder. Do NOT publish this one. However, with the above sequence, this will be
fine, as `yarn build` cleans the build directory first.
