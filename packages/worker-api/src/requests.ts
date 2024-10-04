import {
    createJsonRpcRequest,
    type IWorker,
    type PublicGetterArgs,
    type TrustedGetterArgs,
    type TrustedSignerOptions
} from "./interface.js";
import type {
    BalanceTransferArgs,
    BalanceUnshieldArgs,
    IntegriteeGetter,
    IntegriteeTrustedCall,
    IntegriteeTrustedCallSigned,
    IntegriteeTrustedGetter,
    ShardIdentifier
} from "@encointer/types";
import {asString, signPayload} from "@encointer/util";
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
    const shardT = self.createType('ShardIdentifier', bs58.decode(cid));

    return createGetterRpc(self, g, shardT);
}

export const clientRequestTrustedGetterRpc = async (self: IWorker, request: string, args: TrustedGetterArgs) => {
    const {shard, account} = args;
    const shardT = self.createType('ShardIdentifier', bs58.decode(shard));
    const signedGetter = await createSignedGetter(self, request, account, { signer: args?.signer });
    return createGetterRpc(self, signedGetter, shardT);
}

export const createSignedGetter = async (self: IWorker, request: string, account: AddressOrPair, options: TrustedSignerOptions) => {
    const trustedGetter = createTrustedGetter(self, request, asString(account));
    return await signTrustedGetter(self, account, trustedGetter, options);
}

export const createTrustedGetter = (self: IWorker, request: string, address: string) => {
    return self.createType('IntegriteeTrustedGetter', {
        [request]: address
    });
}

export async function signTrustedGetter(self: IWorker, account: AddressOrPair, getter: IntegriteeTrustedGetter, options?: TrustedSignerOptions): Promise<IntegriteeGetter> {
    const signature = await signPayload(account, getter.toU8a(), options?.signer);
    const g = self.createType('IntegriteeGetter', {
        trusted: {
            getter,
            signature: {Sr25519: signature},
        }
    });

    console.log(`TrustedGetter: ${JSON.stringify(g)}`);
    return g;
}

export const createGetterRpc = (self: IWorker, getter: IntegriteeGetter, shard: ShardIdentifier) => {
    const r = self.createType(
        'Request', {
            shard: shard,
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

export const signTrustedCall = async (
    self: IWorker,
    call: IntegriteeTrustedCall,
    account: AddressOrPair,
    shard: ShardIdentifier,
    mrenclave: string,
    nonce: u32,
    options?: TrustedSignerOptions,
): Promise<IntegriteeTrustedCallSigned> => {
    const hash = self.createType('Hash', bs58.decode(mrenclave));

    const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...hash.toU8a(), ...shard.toU8a()]);

    const signature = await signPayload(account, payload, options?.signer);

    return self.createType('IntegriteeTrustedCallSigned', {
        call: call,
        nonce: nonce,
        signature: {Sr25519: signature},
    });
}
