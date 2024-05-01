import {parseI64F64} from '@encointer/util';
import {u8aToBn} from '@polkadot/util';

import type {IWorker} from './interface.js';
import type {BalanceEntry} from "@encointer/types";
import BN from "bn.js";

import cryptoProvider, {type CryptoKey} from './cryptoProvider.js'

export function parseBalance(self: IWorker, data: any): BalanceEntry {
  const balanceEntry = self.createType('BalanceEntry<BlockNumber>', data);
  // Todo: apply demurrage
  return self.createType('BalanceEntry<BlockNumber>',
    {
      principal: parseI64F64(balanceEntry.principal),
      last_update: balanceEntry.last_update
    }
  );
}

export function parseBalanceType(data: any): number {
  return parseI64F64(u8aToBn(data));
}

export async function parseWebCryptoRSA(data: any): Promise<CryptoKey> {
  const keyJson = JSON.parse(data);

  // Convert Base64url-encoded components to ArrayBuffer
  const nArrayBuffer = new Uint8Array(new BN(keyJson.n, 'le').toArray());
  const eArrayBuffer = new Uint8Array(new BN(keyJson.e).toArray());

  // Import the components into CryptoKey
  const publicKey = await cryptoProvider.subtle.importKey(
      "jwk",
      {
        kty: "RSA",
        e: uint8ArrayToBase64Url(eArrayBuffer),
        n: uint8ArrayToBase64Url(nArrayBuffer),
        ext: true,
      },
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
  );

  console.log(`PublicKey: ${JSON.stringify(publicKey)}`);
  console.log(`PublicKey: ${JSON.stringify(publicKey.e)}`);
  console.log(`PublicKey: ${JSON.stringify(publicKey.n)}`);

  return publicKey;
}

export async function encryptWithPublicKey(data: Uint8Array, publicKey: CryptoKey): Promise<ArrayBuffer> {
    const encryptedData = await cryptoProvider.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
        // @ts-ignore
        publicKey,
        data
  );

  console.log(`EncryptedData: ${encryptedData}`);

  return encryptedData;
}

// function setKeyOpts(key: NodeRSA) {
//   key.setOptions(
//     {
//       // Enforce using the pure javascript implementations by
//       // setting the `browser` environment, as compatibility
//       // with node's crypto is broken and leads to bad outputs.
//       environment: 'browser',
//       encryptionScheme: {
//         scheme: 'pkcs1_oaep',
//         hash: 'sha256',
//         label: ''
//       }
//     }
//   );
// }

function uint8ArrayToBase64Url(uint8Array: Uint8Array): string {
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
