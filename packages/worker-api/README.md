# Encointer Worker API

Encointer Worker

## Installation

```
yarn add @encointer/worker-api
```

## Usage

```
import { useWorker } from '@encointer/worker-api';

const worker = useWorker(api, 'wss://');

const balance = await worker.getBalance(keyPair, cid);
```
