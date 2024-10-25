import type {Vec} from '@polkadot/types';
import {TypeRegistry} from '@polkadot/types';
import type {RegistryTypes} from '@polkadot/types/types';
import {compactAddLength, hexToU8a} from '@polkadot/util';


import {options as encointerOptions} from '@encointer/node-api';

import type {
  EnclaveFingerprint,
  RpcReturnValue, ShardIdentifier,
  TrustedOperationStatus,
  Vault
} from '@encointer/types';

import {
  type GenericGetter,
  type GenericTop,
  type IWorkerBase,
  type TrustedCallResult,
  type WorkerOptions
} from './interface.js';
import {encryptWithPublicKey, parseWebCryptoRSA} from "./webCryptoRSA.js";
import type {Bytes, u8} from "@polkadot/types-codec";
import BN from "bn.js";
import {WsProvider} from "./rpc-provider/src/index.js";
import {Keyring} from "@polkadot/keyring";
import type {Hash} from "@polkadot/types/interfaces/runtime";

export class Worker implements IWorkerBase {

  readonly #registry: TypeRegistry;

  #shieldingKey?: CryptoKey;

  #keyring?: Keyring;

  #ws: WsProvider;

  constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
    this.#registry = new TypeRegistry();
    this.#keyring = (options.keyring || undefined);

    // We want to pass arguments to NodeJS' websocket implementation into the provider
    // in our integration tests, so that we can accept the workers self-signed
    // certificate. Hence, we inject the factory function.
    this.#ws = new WsProvider(url, 100, undefined, undefined, undefined, options.createWebSocket);

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

    console.debug(`Got fingerprint: ${res}`);

    return this.createType('EnclaveFingerprint', res.value);
  }

  public async sendGetter<Getter extends GenericGetter, R>(getter: Getter, shard: ShardIdentifier, returnType: string): Promise<R> {
    const r = this.createType(
        'Request', {
          shard: shard,
          cyphertext: getter.toHex()
        }
    );
    const response = await this.send('state_executeGetter', [r.toHex()])
    const value = unwrapWorkerResponse(this, response.value)
    return this.createType(returnType, value);
  }

  async submitAndWatchTop<Top extends GenericTop>(top: Top, shard: ShardIdentifier): Promise<TrustedCallResult> {

    console.debug(`Sending TrustedOperation: ${JSON.stringify(top)}`);
    const cyphertext = await this.encrypt(top.toU8a());

    const r = this.createType(
        'Request', { shard, cyphertext: cyphertext }
    );

    const returnValue = await this.submitAndWatch([r.toHex()])

    console.debug(`[sendTrustedCall] result: ${JSON.stringify(returnValue)}`);

    return returnValue;
  }


  public async send(method: string, params: unknown[]): Promise<RpcReturnValue> {
    await this.isReady();
    const result = await this.#ws.send(
        method, params
    );

    return this.resultToRpcReturnValue(result);
  }

  public async submitAndWatch(params: unknown[]): Promise<TrustedCallResult> {
    await this.isReady();

    let topHash: Hash;

    return new Promise( async (resolve, reject) => {
      const onStatusChange = (error: Error | null, result: string) => {
        if (error) {
          reject(new Error(`Callback Error: ${error.message}`));
          return;
        }

        console.debug(`DirectRequestStatus: ${JSON.stringify(result)}`);
        const directRequestStatus = this.createType('DirectRequestStatus', result);

        if (directRequestStatus.isError) {
          const errorMsg = this.createType('String', directRequestStatus.value);
          reject(new Error(`DirectRequestStatus is Error: ${errorMsg}`));
        } else if (directRequestStatus.isOk) {
          resolve({topHash, status: undefined});
        } else if (directRequestStatus.isTrustedOperationStatus) {
          console.log(`TrustedOperationStatus: ${directRequestStatus}`);
          const status = directRequestStatus.asTrustedOperationStatus;

          if (connection_can_be_closed(status)) {
            resolve({topHash, status});
          }
        }
      }

      try {
        const res = await this.#ws.subscribe('author_submitAndWatchExtrinsic',
            'author_submitAndWatchExtrinsic', params, onStatusChange
        );
        topHash = this.createType('Hash', res);
        console.debug(`topHash: ${topHash}`);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    })
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

/**
 * Defaults to return `[]`, which is fine as `createType(api.registry, <type>, [])`
 * instantiates the <type> with its default value.
 */
function unwrapWorkerResponse (self: Worker, data: Bytes) {
  const dataTyped = self.createType('Option<WorkerEncoded>', data)
  return dataTyped.unwrapOrDefault();
}
