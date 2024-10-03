import {
    createJsonRpcRequest,
    type IWorker, type PublicGetterArgs,
    type TrustedGetterArgs
} from "./interface.js";
import type {
    BalanceTransferArgs,
    BalanceUnshieldArgs,
    ShardIdentifier,
    IntegriteeTrustedCallSigned,
    IntegriteeTrustedCall, IntegriteeGetter, IntegriteeTrustedGetter
} from "@encointer/types";
import {signPayload} from "@encointer/util";
import type {u32} from "@polkadot/types";
import bs58 from "bs58";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";
import type {Signer} from "@polkadot/types/types";

// Todo: Properly resolve cid vs shard
export const clientRequestGetterRpc = (self: IWorker, request: string, args: PublicGetterArgs) => {
    const {cid} = args;
    const getter = self.createType('IntegriteePublicGetter', {
        [request]: cid
    });

    const g = self.createType('IntegriteeGetter', {
        public: {
            getter,
        }
    });

    return createGetterRpc(self, g, cid);
}

export const clientRequestTrustedGetterRpc = async (self: IWorker, request: string, args: TrustedGetterArgs) => {
    const {shard, account} = args;
    const trustedGetter = createTrustedGetter(self, request, args);
    const signedGetter = await signTrustedGetter(self, account, trustedGetter);
    return createGetterRpc(self, signedGetter, shard);
}

export const createTrustedGetter = (self: IWorker, request: string, args: TrustedGetterArgs) => {
    const {account} = args;
    const address = account.address;
    return self.createType('IntegriteeTrustedGetter', {
        [request]: address
    });
}

export async function signTrustedGetter(self: IWorker, account: AddressOrPair, getter: IntegriteeTrustedGetter, signer?: Signer): Promise<IntegriteeGetter> {
    const signature = signPayload(account, getter.toU8a(), signer);
    const g = self.createType('IntegriteeGetter', {
        trusted: {
            getter,
            signature: {Sr25519: signature},
        }
    });

    console.log(`TrustedGetter: ${JSON.stringify(g)}`);
    return g;
}

export const createGetterRpc = (self: IWorker, getter: IntegriteeGetter, shard: string) => {
    const s = self.createType('ShardIdentifier', bs58.decode(shard));
    const r = self.createType(
        'Request', {
            shard: s,
            cyphertext: getter.toHex()
        }
    );

    return createJsonRpcRequest('state_executeGetter', [r.toHex()], 1);
}


export type TrustedCallArgs = (BalanceTransferArgs | BalanceUnshieldArgs);

export type TrustedCallVariant = [string, string]

export const createTrustedCall = (
    self: IWorker,
    trustedCall: TrustedCallVariant,
    params: TrustedCallArgs
): IntegriteeTrustedCall => {
    const [variant, argType] = trustedCall;

    return self.createType('IntegriteeTrustedCall', {
        [variant]: self.createType(argType, params)
    });
}

export async function signTrustedCall(
    self: IWorker,
    call: IntegriteeTrustedCall,
    account: AddressOrPair,
    shard: ShardIdentifier,
    mrenclave: string,
    nonce: u32,
    signer?: Signer,
): Promise<IntegriteeTrustedCallSigned> {
    const hash = self.createType('Hash', bs58.decode(mrenclave));

    const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...hash.toU8a(), ...shard.toU8a()]);

    const signature = await signPayload(account, payload, signer);

    return self.createType('IntegriteeTrustedCallSigned', {
        call: call,
        nonce: nonce,
        signature: {Sr25519: signature},
    });
}
