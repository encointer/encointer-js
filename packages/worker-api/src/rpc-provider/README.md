The RPC provider is a subset of https://github.com/polkadot-js/api/tree/master/packages/rpc-provider.

However, it contains a small but crucial change for us:

The reason it lives here, is only because we want to be able to inject a websocket for integration testing against local setups for the integritee worker, which means the websocket needs accept self-signed certificates.
