
let cryptoProvider: any;

export type CryptoKey = import("crypto").KeyObject | import("@peculiar/webcrypto").CryptoKey;

if (typeof window !== "undefined" && typeof window.crypto !== "undefined") {
    cryptoProvider = window.crypto;
} else {
    const { Crypto } = require("@peculiar/webcrypto");
    cryptoProvider = new Crypto();
}

export default cryptoProvider;
