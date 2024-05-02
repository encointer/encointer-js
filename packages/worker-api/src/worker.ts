import type {Vec} from '@polkadot/types';
import {TypeRegistry} from '@polkadot/types';
import type {RegistryTypes} from '@polkadot/types/types';
import {Keyring} from '@polkadot/keyring'
import {compactAddLength, hexToU8a} from '@polkadot/util';

import WebSocketAsPromised from 'websocket-as-promised';

import {options as encointerOptions} from '@encointer/node-api';
import {parseI64F64} from '@encointer/util';

import type {
  Vault
} from '@encointer/types';

import {type CallOptions, type IWorker, Request, type WorkerOptions} from './interface.js';
import {parseBalance} from './parsers.js';
import {callGetter} from './sendRequest.js';
import {parseWebCryptoRSA, encryptWithPublicKey} from "./webCryptoRSA.js";
import type {u8} from "@polkadot/types-codec";
import BN from "bn.js";

const unwrapWorkerResponse = (self: IWorker, data: string) => {
  /// Defaults to return `[]`, which is fine as `createType(api.registry, <type>, [])`
  /// instantiates the <type> with its default value.
  const dataTyped = self.createType('Option<WorkerEncoded>', data)
  return dataTyped.unwrapOrDefault();
}

const parseGetterResponse = (self: IWorker, responseType: string, data: string) => {
  if (data === 'Could not decode request') {
    throw new Error(`Worker error: ${data}`);
  }

  // console.log(`Getter response: ${data}`);
  const json = JSON.parse(data);

  const value = hexToU8a(json["result"]);
  const returnValue = self.createType('RpcReturnValue', value);
  console.log(`RpcReturnValue ${JSON.stringify(returnValue)}`);

  if (returnValue.status.isError) {
    const errorMsg = self.createType('String', returnValue.value);
    throw new Error(`RPC Error: ${errorMsg}`);
  }

  let parsedData: any;
  try {
    switch (responseType) {
      case 'raw':
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        break;
      case 'BalanceEntry':
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        parsedData = parseBalance(self, parsedData);
        break;
      case 'I64F64':
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        parsedData = parseI64F64(self.createType('i128', parsedData));
        break;
      case 'CryptoKey':
        const jsonStr = self.createType('String', returnValue.value);
        // Todo: For some reason there are 2 non-utf characters, where I don't know where
        // they come from currently.
        console.log(`Got shielding key: ${jsonStr.toJSON().substring(2)}`);
        parsedData = parseWebCryptoRSA(jsonStr.toJSON().substring(2));
        break
      case 'Vault':
        parsedData = self.createType(responseType, returnValue.value);
        break
      case 'TrustedOperationResult':
        console.log(`Got TrustedOperationResult`)
        parsedData = self.createType('Hash', returnValue.value);
        break
      default:
        parsedData = unwrapWorkerResponse(self, returnValue.value);
        console.log(`unwrapped data ${parsedData}`);
        parsedData = self.createType(responseType, parsedData);
        break;
    }
  } catch (err) {
    throw new Error(`Can't parse into ${responseType}:\n${err}`);
  }
  return parsedData;
}

export class Worker extends WebSocketAsPromised implements IWorker {

  readonly #registry: TypeRegistry;

  #keyring?: Keyring;

  #shieldingKey?: CryptoKey

  rsCount: number;

  rqStack: string[];

  constructor(url: string, options: WorkerOptions = {} as WorkerOptions) {
    super(url, {
      createWebSocket: (options.createWebSocket || undefined),
      packMessage: (data: any) => JSON.stringify(data),
      unpackMessage: (data: any) => parseGetterResponse(this, this.rqStack.shift() || '', data),
      attachRequestId: (data: any): any => data,
      extractRequestId: () => this.rsCount = ++this.rsCount
    });
    this.#keyring = (options.keyring || undefined);
    this.#registry = new TypeRegistry();
    this.rsCount = 0;
    this.rqStack = [] as string[]

    if (options.types != undefined) {
      this.#registry.register(encointerOptions({types: options.types}).types as RegistryTypes);
    } else {
      this.#registry.register(encointerOptions().types as RegistryTypes);
    }
  }

  public async encrypt(data: Uint8Array): Promise<Vec<u8>> {
    const inputData = data;
    const dataBE = new BN(inputData);
    const dataArrayBE = new Uint8Array(dataBE.toArray());

    const cypherTextBuffer = await encryptWithPublicKey(dataArrayBE, this.shieldingKey() as CryptoKey);
    const cypherArray = new Uint8Array(cypherTextBuffer);

    const outputData = cypherArray;
    const be = new BN(outputData)
    const beArray = new Uint8Array(be.toArray());

    console.log(`${JSON.stringify({encrypted_array: beArray})}`)

    return this.createType('Vec<u8>', compactAddLength(beArray))
  }

  public registry(): TypeRegistry {
    return this.#registry
  }

  public createType(apiType: string, obj?: any): any {
    return this.#registry.createType(apiType as never, obj)
  }

  public keyring(): Keyring | undefined {
    return this.#keyring;
  }

  public setKeyring(keyring: Keyring): void {
    this.#keyring = keyring;
  }

  public shieldingKey(): CryptoKey | undefined {
    return this.#shieldingKey;
  }

  public setShieldingKey(shieldingKey: CryptoKey): void {
    this.#shieldingKey = shieldingKey;
  }

  public async getShieldingKey(options: CallOptions = {} as CallOptions): Promise<CryptoKey> {
    const key = await callGetter<CryptoKey>(this, [Request.Worker, 'author_getShieldingKey', 'CryptoKey'], {}, options)
    this.setShieldingKey(key);
    return key;
  }

  public async getShardVault(options: CallOptions = {} as CallOptions): Promise<Vault> {
    return await callGetter<Vault>(this, [Request.Worker, 'author_getShardVault', 'Vault'], {}, options)
  }
}

// function changeByteAndBitEndianness(bytes: Uint8Array): Uint8Array {
//   const reversedBytes = changeEndianness(bytes);
//   const changedBytes = new Uint8Array(reversedBytes.length);
//   for (let i = 0; i < reversedBytes.length; i++) {
//     changedBytes[i] = changeBitEndianness(reversedBytes[i]);
//   }
//   return changedBytes;
// }
//
// function changeEndianness(bytes: Uint8Array): Uint8Array {
//   const reversedBytes = new Uint8Array(bytes.length);
//   for (let i = 0; i < bytes.length; i++) {
//     reversedBytes[i] = bytes[bytes.length - i - 1];
//   }
//   return reversedBytes;
// }
//
// function changeBitEndianness(value: number): number {
//   // Bit reversal algorithm: https://graphics.stanford.edu/~seander/bithacks.html#ReverseByteWith64Bits
//   value = ((value >> 1) & 0x55555555) | ((value & 0x55555555) << 1);
//   value = ((value >> 2) & 0x33333333) | ((value & 0x33333333) << 2);
//   value = ((value >> 4) & 0x0F0F0F0F) | ((value & 0x0F0F0F0F) << 4);
//   value = ((value >> 8) & 0x00FF00FF) | ((value & 0x00FF00FF) << 8);
//   value = (value >> 16) | (value << 16);
//   return value >>> 24; // Unsigned right shift to discard excess bits
// }
