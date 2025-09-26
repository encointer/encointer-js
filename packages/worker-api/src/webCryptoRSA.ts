/**
 * Import an RSA public key from modulus+exponent byte arrays.
 */
export async function parseWebCryptoRSA(data: string): Promise<CryptoKey> {
    const keyJson = JSON.parse(data);

    const nB64Url = toBase64Url(Uint8Array.from(keyJson.n));
    const eB64Url = toBase64Url(Uint8Array.from(keyJson.e));

    const jwk = {
        kty: "RSA",
        n: nB64Url,
        e: eB64Url,
        ext: true,
    };

    // Debug check
    // console.log("Importing JWK:", jwk);

    return globalThis.crypto.subtle.importKey(
        "jwk",
        jwk,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    );
}

export async function encryptWithPublicKey(
    data: Uint8Array,
    publicKey: CryptoKey
): Promise<ArrayBuffer> {
    return globalThis.crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, data);
}

function toBase64Url(buf: Uint8Array): string {
    return Buffer.from(buf)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}
