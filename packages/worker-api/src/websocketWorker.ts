import type {Vec} from '@polkadot/types';
import {TypeRegistry} from '@polkadot/types';
import type {RegistryTypes} from '@polkadot/types/types';
import {compactAddLength, hexToU8a} from '@polkadot/util';


import {options as encointerOptions} from '@encointer/node-api';

import type {EnclaveFingerprint, RpcReturnValue, Vault} from '@encointer/types';

import { type WorkerOptions} from './interface.js';
import {encryptWithPublicKey, parseWebCryptoRSA} from "./webCryptoRSA.js";
import type {u8} from "@polkadot/types-codec";
import BN from "bn.js";
import {WsProvider} from "@polkadot/api";

export class Worker {

    readonly #registry: TypeRegistry;

    #shieldingKey?: CryptoKey;

    #ws: WsProvider;

    constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
        this.#registry = new TypeRegistry();
        this.#ws = new WsProvider(url);

        if (options.types != undefined) {
            this.#registry.register(encointerOptions({types: options.types}).types as RegistryTypes);
        } else {
            this.#registry.register(encointerOptions().types as RegistryTypes);
        }
    }

    public async isReady(): Promise<WsProvider> {
        return this.#ws.isReady
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

        if (result === 'Could not decode request') {
            throw new Error(`Worker error: ${result}`);
        }

        const value = hexToU8a(result);
        const returnValue = this.createType('RpcReturnValue', value);
        console.debug(`RpcReturnValue ${JSON.stringify(returnValue)}`);

        if (returnValue.status.isError) {
            const errorMsg = this.createType('String', returnValue.value);
            throw new Error(`RPC Error: ${errorMsg}`);
        }

        return returnValue;
    }
}
