import BN from "bn.js";

/**
 * Import an RSA public key from modulus+exponent byte arrays.
 */
export async function parseWebCryptoRSA(data: string): Promise<CryptoKey> {
    const keyJson = JSON.parse(data);

    // Convert Base64url-encoded components to ArrayBuffer
    const nArrayBuffer = new Uint8Array(new BN(keyJson.n, 'le').toArray());
    const eArrayBuffer = new Uint8Array(new BN(keyJson.e, 'le').toArray());

    // Import the components into CryptoKey
    const publicKey = await globalThis.crypto.subtle.importKey(
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

    return publicKey;
}

export async function encryptWithPublicKey(data: Uint8Array, publicKey: CryptoKey): Promise<ArrayBuffer> {
    const encryptedData = await globalThis.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,
        data
    );

    // console.log(`EncryptedData: ${JSON.stringify({encrypted: buf2hex(encryptedData)})}`);

    return encryptedData;
}


function uint8ArrayToBase64Url(uint8Array: Uint8Array): string {
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
