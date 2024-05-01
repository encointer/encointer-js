import BN from "bn.js";

export async function parseWebCryptoRSA(data: any): Promise<CryptoKey> {
    const keyJson = JSON.parse(data);

    // Convert Base64url-encoded components to ArrayBuffer
    const nArrayBuffer = new Uint8Array(new BN(keyJson.n, 'le').toArray());
    const eArrayBuffer = new Uint8Array(new BN(keyJson.e).toArray());

    // Import the components into CryptoKey
    const publicKey = await window.crypto.subtle.importKey(
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

    const exported = window.crypto.subtle.exportKey("jwk", publicKey);
    console.log(`PublicKey: ${JSON.stringify(exported)}`);

    return publicKey;
}

export async function encryptWithPublicKey(data: Uint8Array, publicKey: CryptoKey): Promise<ArrayBuffer> {
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        // @ts-ignore
        publicKey,
        data
    );

    console.log(`EncryptedData: ${JSON.stringify(encryptedData)}`);

    return encryptedData;
}


function uint8ArrayToBase64Url(uint8Array: Uint8Array): string {
    const base64String = btoa(String.fromCharCode(...uint8Array));
    return base64String
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
