# Encointer Worker API

Encointer Cantillon uses workers to confidentially process your calls inside TEEs. In order to use Encointer currencies, you will be interacting with workers. This package provides way to query currency data like total issuance or balance of users account from worker TEE. See [Encointer Book](https://book.encointer.org/testnet-cantillon.html) form more information.

## Installation

```
yarn add @encointer/worker-api
```

## Usage

```js
import { EncointerWorker } from '@encointer/worker-api';
import { options } from '@encointer/node-api'

import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

currencyId = '3LjCHdiNbNLKEtwGtBf6qHGZnfKFyjLu9v3uxVgDL35C';

// In async function
const api = await ApiPromise.create({
    ...options(),
    provider: new WsProvider(nodeAddr)
});

const workerEndpoint = await api.query.substrateeRegistry.enclaveRegistry(1)

const worker = new EncointerWorker(workerEndpoint, { api });

const total = await worker.getTotalIssuance(currencyId);

console.log('Total issuance:', total);
```
