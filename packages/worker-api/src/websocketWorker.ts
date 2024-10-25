import type {Vec} from '@polkadot/types';
import {TypeRegistry} from '@polkadot/types';
import type {RegistryTypes} from '@polkadot/types/types';
import {compactAddLength, hexToU8a} from '@polkadot/util';


import {options as encointerOptions} from '@encointer/node-api';

import type {
    EnclaveFingerprint,
    RpcReturnValue,
    TrustedOperationStatus,
    Vault
} from '@encointer/types';

import {type WorkerOptions} from './interface.js';
import {encryptWithPublicKey, parseWebCryptoRSA} from "./webCryptoRSA.js";
import type {u8} from "@polkadot/types-codec";
import BN from "bn.js";
import {WsProvider} from "@polkadot/api";
import {Keyring} from "@polkadot/keyring";

export class Worker {

    readonly #registry: TypeRegistry;

    #shieldingKey?: CryptoKey;

    #keyring?: Keyring;

    #ws: WsProvider;

    constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
        this.#registry = new TypeRegistry();
        this.#ws = new WsProvider(url);
        this.#keyring = (options.keyring || undefined);


        if (options.types != undefined) {
            this.#registry.register(encointerOptions({types: options.types}).types as RegistryTypes);
        } else {
            this.#registry.register(encointerOptions().types as RegistryTypes);
        }
    }

    public async isReady(): Promise<WsProvider> {
        return this.#ws.isReady
    }

    public async closeWs(): Promise<void> {
        return this.#ws.disconnect()
    }

    public async encrypt(data: Uint8Array): Promise<Vec<u8>> {
        const dataBE = new BN(data);
        const dataArrayBE = new Uint8Array(dataBE.toArray());

        const cypherTextBuffer = await encryptWithPublicKey(dataArrayBE, this.shieldingKey() as CryptoKey);

        const outputData = new Uint8Array(cypherTextBuffer);
        const be = new BN(outputData)
        const beArray = new Uint8Array(be.toArray());

        // console.debug(`${JSON.stringify({encrypted_array: beArray})}`)

        return this.createType('Vec<u8>', compactAddLength(beArray))
    }


    public keyring(): Keyring | undefined {
        return this.#keyring;
    }

    public setKeyring(keyring: Keyring): void {
        this.#keyring = keyring;
    }


    public registry(): TypeRegistry {
        return this.#registry
    }

    public createType(apiType: string, obj?: any): any {
        return this.#registry.createType(apiType as never, obj)
    }

    public shieldingKey(): CryptoKey | undefined {
        return this.#shieldingKey;
    }

    public setShieldingKey(shieldingKey: CryptoKey): void {
        this.#shieldingKey = shieldingKey;
    }

    public async getShieldingKey(): Promise<CryptoKey> {
        const res = await this.send(
            'author_getShieldingKey',[]
        );

        const jsonStr = this.createType('String', res.value);
        // Todo: For some reason there are 2 non-utf characters, where I don't know where
        // they come from currently.
        // console.debug(`Got shielding key: ${jsonStr.toJSON().substring(2)}`);
        const key = await parseWebCryptoRSA(jsonStr.toJSON().substring(2));

        // @ts-ignore
        this.setShieldingKey(key);
        // @ts-ignore
        return key;
    }

    public async getShardVault(): Promise<Vault> {
        const res = await this.send(
            'author_getShardVault',[]
        );

        console.debug(`Got vault key: ${JSON.stringify(res)}`);
        return this.createType('Vault', res.value);
    }

    public async getFingerprint(): Promise<EnclaveFingerprint> {
        const res = await this.send(
            'author_getFingerprint',[]
        );

        console.debug(`Got fingerprint key: ${res}`);

        return this.createType('EnclaveFingerprint', res.value);
    }


    public async send(method: string, params: unknown[]): Promise<RpcReturnValue> {
        await this.isReady();
        const result = await this.#ws.send(
            method, params
        );

        return this.resultToRpcReturnValue(result);
    }

    public async subscribe(method: string, params: unknown[]): Promise<any> {
        await this.isReady();

        return new Promise((async resolve => {
            // @ts-ignore
            const onStatusChange = (error, result: string) => {
                console.debug(`DirectRequestStatus: error ${JSON.stringify(error)}`)
                console.debug(`DirectRequestStatus: ${JSON.stringify(result)}`)

                const value = hexToU8a(result);
                const returnValue = this.createType('RpcReturnValue', value);

                if (returnValue.isError) {
                    const errorMsg = this.createType('String', returnValue.value);
                    throw new Error(`DirectRequestStatus is Error ${errorMsg}`);
                }
                if (returnValue.isOk) {
                    const hash = this.createType('Hash', returnValue.value);
                    resolve({hash: hash})
                }

                if (returnValue.isTrustedOperationStatus) {
                    const status = returnValue.asTrustedOperationStatus;
                    const hash = this.createType('Hash', returnValue.value);
                    if (connection_can_be_closed(status)) {
                        resolve({hash: hash})
                    }
                }

                throw( new Error(`Hello: ${JSON.stringify(returnValue)}`));
            }

            try {
                const res = await this.#ws.subscribe('type',
                    method, params, onStatusChange
                );
                console.debug(`{res: ${res}`);
                let returnValue = this.resultToRpcReturnValue(res as string);
                console.debug(`{result: ${res}`);
                let topHash = this.createType('Hash', returnValue.value)
                console.debug(`{topHash: ${topHash}`);
            } catch (err) {
                console.error(err);
                throw(err)
            }
        }))
    }

    resultToRpcReturnValue(result: string): RpcReturnValue {
        if (result === 'Could not decode request') {
            throw new Error(`Worker error: ${result}`);
        }

        const value = hexToU8a(result);
        const returnValue = this.createType('RpcReturnValue', value);
        console.debug(`RpcReturnValue ${JSON.stringify(returnValue)}`);

        if (returnValue.status.isError) {
            const errorMsg = this.createType('String', returnValue.value);
            throw new Error(`RPC: ${errorMsg}`);
        }

        return returnValue;
    }
}

function connection_can_be_closed(status: TrustedOperationStatus): boolean {
    return !(status.isSubmitted || status.isFuture || status.isReady || status.isBroadCast || status.isInvalid)
}
