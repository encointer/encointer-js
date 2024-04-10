import {
    createJsonRpcRequest,
    type IWorker, type PublicGetterArgs,
    type TrustedGetterArgs
} from "@encointer/worker-api/interface.js";
import type {BalanceTransferArgs, BalanceUnshieldArgs, ShardIdentifier, IntegriteeTrustedCallSigned} from "@encointer/types";
import type {KeyringPair} from "@polkadot/keyring/types";
import {type PubKeyPinPair, toAccount} from "@encointer/util/common.js";
import type {u32} from "@polkadot/types";
import bs58 from "bs58";

// Todo: Properly resolve cid vs shard
export const clientRequestGetter = (self: IWorker, request: string, args: PublicGetterArgs) => {
    const { cid } = args;
    const getter = self.createType('IntegriteePublicGetter', {
        [request]: cid
    });

    const g = self.createType( 'IntegriteeGetter',{
        public: {
            getter,
        }
    });

    const r = self.createType(
        'Request', { shard: cid, cyphertext: g.toU8a() }
    );

    return createJsonRpcRequest('state_executeGetter', [r.toHex()],1);
}

export const clientRequestTrustedGetter = (self: IWorker, request: string, args: TrustedGetterArgs) => {
    const {shard, account} = args;
    const address = account.address;
    const getter = self.createType('IntegriteeTrustedGetter', {
        [request]: address
    });

    const signature = account.sign(getter.toU8a());
    const g = self.createType( 'IntegriteeGetter',{
        trusted: {
            getter,
            signature: { Sr25519: signature },
        }
    });

    console.log(`TrustedGetter: ${JSON.stringify(g)}`);

    const s = self.createType('ShardIdentifier', bs58.decode(shard));
    const r = self.createType(
        'Request', {
            shard: s,
            cyphertext: g.toHex()
        }
    );

    return createJsonRpcRequest('state_executeGetter', [r.toHex()],1);
}

export type TrustedCallArgs = (BalanceTransferArgs | BalanceUnshieldArgs);

export type TrustedCallVariant = [string, string]

export const createTrustedCall = (
    self: IWorker,
    trustedCall: TrustedCallVariant,
    accountOrPubKey: (KeyringPair | PubKeyPinPair),
    shard: ShardIdentifier,
    mrenclave: string,
    nonce: u32,
    params: TrustedCallArgs
): IntegriteeTrustedCallSigned => {

    const [variant, argType] = trustedCall;
    const hash = self.createType('Hash', bs58.decode(mrenclave));

    const call = self.createType('IntegriteeTrustedCall', {
        [variant]: self.createType(argType, params)
    });

    const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...hash.toU8a(), ...shard.toU8a()]);

    return self.createType('IntegriteeIntegriteeTrustedCallSigned', {
        call: call,
        nonce: nonce,
        signature: { Sr25519: toAccount(accountOrPubKey, self.keyring()).sign(payload) },
    });
}
