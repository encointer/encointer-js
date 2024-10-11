import {
    createJsonRpcRequest,
    type IWorker, type PublicGetterParams, type TrustedGetterParams,
    type TrustedSignerOptions
} from "./interface.js";
import type {
    BalanceTransferArgs,
    BalanceUnshieldArgs, GuessTheNumberTrustedCall,
    IntegriteeGetter, IntegriteePublicGetter,
    IntegriteeTrustedCall,
    IntegriteeTrustedCallSigned,
    IntegriteeTrustedGetter,
    ShardIdentifier
} from "@encointer/types";
import {signPayload} from "@encointer/util";
import type {u32} from "@polkadot/types";
import bs58 from "bs58";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";

export const createIntegriteeGetterPublic = (self: IWorker, request: string, publicGetterParams: PublicGetterParams) => {
    const getter = publicGetter(self, request, publicGetterParams);

    const g = self.createType('IntegriteeGetter', {
        public: {
            getter
        }
    });

    return g;
}

export function publicGetter(self: IWorker, request: string, publicGetterParams: PublicGetterParams): IntegriteePublicGetter {
    return self.createType('IntegriteePublicGetter', {
        [request]: publicGetterParams
    });
}

export const createSignedGetter = async (self: IWorker, request: string, account: AddressOrPair, trustedGetterParams: TrustedGetterParams, options: TrustedSignerOptions) => {
    const trustedGetter = createTrustedGetter(self, request, trustedGetterParams);
    return await signTrustedGetter(self, account, trustedGetter, options);
}

export const createTrustedGetter = (self: IWorker, request: string, params: TrustedGetterParams) => {
    return self.createType('IntegriteeTrustedGetter', {
        [request]: params
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

    // console.log(`TrustedGetter: ${JSON.stringify(g)}`);
    // console.log(`TrustedGetter Encoded: ${g.toU8a()}`);
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


export type TrustedCallArgs = (BalanceTransferArgs | BalanceUnshieldArgs | GuessTheNumberTrustedCall);

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
