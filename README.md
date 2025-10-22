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

# Update deps
Usually, we update the deps when we require a `@polkadot` update. The following paradigm should ensure a smooth process.

1. Always use `yarn upgrade-interactive` to ensure that packages are updated in **all** workspace libs.
2. Upgrade all `@polkadot/*` deps except `@polkadot/dev` (dev might screw with the build process).
3. Run `yarn generate:types`.
4. Check if `yarn build` and `yarn test` works (optional: check integration tests).
5. Ensure that `bn.js` version matches the one from the `@polkadot/api` GitHub repo. In the past, we had issues with the codec of our fixed point stuff because of a mismatch here.

If everything works, we could stop here. If not (or if we want to do our chores), we do:

1. Update `typescript` and `tslib` and see if build and test works
2. Update other unproblematic libs (aka all deps introduced by our code)
   - If `@peculiar/webcrypto` is updated, we might want to check that the Incognitee Frontend still works
3. Finally, we could update our build and testing framework libs (babel, node and jest).

## 🚀 Releasing Packages

This project uses **Lerna**, **Yarn Zero-Install**, and **npm Trusted Publishing** to release packages automatically through GitHub Actions.

### Local release steps

1. Bump versions and create a tag:
   ```bash
   lerna version --force-publish
   ```
    This updates all package.json files, commits the change, and creates a version tag (e.g. v1.2.3 or v1.2.3-alpha.0) and pushes the tag.
   
That’s it — CI takes over from here.

### What happens in CI
When a tag is pushed:

1. GitHub Actions checks out the code and uses the cached Yarn dependencies (Zero-Install).
2. Versions are verified to match the git tag.
3. All packages are built (yarn build).
4. The workflow automatically detects whether it’s a pre-release tag (alpha, beta, dev, etc.).
5. Lerna publishes the built packages to npm using Trusted Publishing with provenance, under the correct npm dist-tag.

| Example Tag        | Published npm dist-tag |
| ------------------ | ---------------------- |
| `v1.2.3`           | `latest`               |
| `v1.2.3-alpha.0`   | `alpha`                |
| `v1.2.3-dev.2`     | `dev`                  |
| `v1.2.3-preview.1` | `preview`              |

### Security
This setup uses npm Trusted Publishing (OIDC) — no NPM_TOKEN is stored in CI.
All releases include provenance metadata that proves they were built from this repository.
