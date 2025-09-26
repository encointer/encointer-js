import {
    type IWorkerBase, type PublicGetterParams, type TrustedGetterParams,
    type TrustedSignerOptions
} from "./interface.js";
import type {
    BalanceTransferArgs,
    BalanceUnshieldArgs, CreditsTrustedCall, EnclaveFingerprint, GuessTheNumberTrustedCall,
    IntegriteeGetter,
    IntegriteeTrustedCall,
    IntegriteeTrustedCallSigned,
    IntegriteeTrustedGetter,
    ShardIdentifier
} from "@encointer/types";
import {asString, signPayload} from "@encointer/util";
import type {u32} from "@polkadot/types";
import type {AddressOrPair} from "@polkadot/api-base/types/submittable";

export const createIntegriteeGetterPublic = (self: IWorkerBase, request: string, publicGetterParams: PublicGetterParams) => {
    const g = self.createType('IntegriteeGetter', {
        public: {
            [request]: publicGetterParams ,
        }
    });
    return g;
}

export const createSignedGetter = async (self: IWorkerBase, request: string, account: AddressOrPair, trustedGetterParams: TrustedGetterParams, options: TrustedSignerOptions) => {
    const trustedGetter = createTrustedGetter(self, request, trustedGetterParams);
    return await signTrustedGetter(self, account, trustedGetter, options);
}

export const createTrustedGetter = (self: IWorkerBase, request: string, params: TrustedGetterParams) => {
    return self.createType('IntegriteeTrustedGetter', {
        [request]: params
    });
}

export async function signTrustedGetter(self: IWorkerBase, account: AddressOrPair, getter: IntegriteeTrustedGetter, options?: TrustedSignerOptions): Promise<IntegriteeGetter> {
    // delegate overrides signer extension option
    const signature = await signPayload(options?.delegate ? options.delegate : account, getter.toU8a(), options?.delegate ? undefined : options?.signer);
    const g = self.createType('IntegriteeGetter', {
        trusted: {
            getter,
            delegate: options?.delegate ? asString(options.delegate) : null,
            signature: {Sr25519: signature},
        }
    });

    console.debug(`Signed TrustedGetter: ${JSON.stringify(g)}`);
    return g;
}

export type TrustedCallArgs = (BalanceTransferArgs | BalanceUnshieldArgs | GuessTheNumberTrustedCall | CreditsTrustedCall);

export type TrustedCallVariant = [string, string]

export const createTrustedCall = (
    self: IWorkerBase,
    trustedCall: TrustedCallVariant,
    params: TrustedCallArgs
): IntegriteeTrustedCall => {
    const [variant, argType] = trustedCall;

    return self.createType('IntegriteeTrustedCall', {
        [variant]: self.createType(argType, params)
    });
}

export const signTrustedCall = async (
    self: IWorkerBase,
    call: IntegriteeTrustedCall,
    account: AddressOrPair,
    shard: ShardIdentifier,
    mrenclave: EnclaveFingerprint,
    nonce: u32,
    options?: TrustedSignerOptions,
): Promise<IntegriteeTrustedCallSigned> => {
    const payload = Uint8Array.from([...call.toU8a(), ...nonce.toU8a(), ...mrenclave.toU8a(), ...shard.toU8a()]);

    // delegate overrides signer extension option
    const signature = await signPayload(options?.delegate ? options.delegate : account, payload, options?.delegate ? undefined : options?.signer);

    return self.createType('IntegriteeTrustedCallSigned', {
        call: call,
        nonce: nonce,
        delegate: options?.delegate ? asString(options.delegate) : null,
        signature: {Sr25519: signature},
    });
}
