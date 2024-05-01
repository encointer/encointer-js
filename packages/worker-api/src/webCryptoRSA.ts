import BN from "bn.js";

/**
 * Provides crypto the browser via the native crypto, and in the node-js environment (like our tests)
 * via the `@peculiar/webcrypto` polyfill.
 */
let cryptoProvider: any;

if (typeof window !== "undefined" && typeof window.crypto !== "undefined") {
    cryptoProvider = window.crypto;
} else {
    const { Crypto } = require("@peculiar/webcrypto");
    cryptoProvider = new Crypto();
}

/**
 * Type depending on our environment browser vs. node-js.
 */
type CryptoKey = import("crypto").KeyObject | import("@peculiar/webcrypto").CryptoKey;


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

    const exported = cryptoProvider.subtle.exportKey("jwk", publicKey);
    console.log(`PublicKey: ${JSON.stringify({pubkey: buf2hex(exported)})}`);

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

    console.log(`EncryptedData: ${JSON.stringify({encrypted: buf2hex(encryptedData)})}`);

    return encryptedData;
}


function uint8ArrayToBase64Url(uint8Array: Uint8Array): string {
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function buf2hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
