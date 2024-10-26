# Encointer JS

Encointer JavaScript API monorepo

# Contains

- [@encointer/types](packages/types/) Encointer type definitions
- [@encointer/node-api](packages/node-api/) The Node API
- [@encointer/worker-api](packages/worker-api/) The Worker API
- [@encointer/util](packages/util/) utilities to work with Encointer specific data

# Installation

## Crypto library
The worker uses the webcrypto api if it is run in the browser. This library is only
defined if you access the webpage with `localhost` in firefox. It is not available
on `127.0.0.1` or `0.0.0.0` due to browser security policies.

## Testing
Use the below command to only execute a particular test suite.

**Note:** The worker tests are skipped by default, as they need a running setup.

```bash
// execute worker tests
yarn test --runTestsByPath packages/worker-api/src/integriteeWorker.spec.ts 
```

```bash
yarn add @encointer/node-api @encointer/worker-api
```

# Usage example
There are some more examples in `./node-api/src/e2e.ts`.

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
// Note: `lerna version` will use the `version` hook defined in the root package.json. 
lerna version --force-publish

// apply changes from package.json to */build/package.json 
yarn build

// publish all changes from the build directory to npm
lerna publish from-package --contents build
```

The lerna commands have been added as scripts to the `package.json`.
