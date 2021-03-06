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
import { cryptoWaitReady } from '@polkadot/util-crypto';

communityId = '3LjCHdiNbNLKEtwGtBf6qHGZnfKFyjLu9v3uxVgDL35C';

// In async function
const api = await ApiPromise.create({
    ...options(),
    provider: new WsProvider(nodeAddr)
});

const workerEndpoint = await api.query.substrateeRegistry.enclaveRegistry(1)

const worker = new EncointerWorker(workerEndpoint, { api });

// PublicGetter
const total = await worker.getTotalIssuance(communityId);

await cryptoWaitReady();
const bob = keyring.addFromUri('//Bob', { name: 'Bob default' });

// TrustedGetter version 1
const index = await worker.getParticipantIndex(bob, network.chosenCid);

// TrustedGetter version 2
worker.setKeyring(keyring) // see keyring setup in 'worker.spec.ts'
const balance = await worker.getBalance({ 
    pubKey: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 
    pin: '<account pin>' 
  }, network.chosenCid
);

console.log('Total issuance:', total);
```
