import { parseI64F64 } from '@encointer/util/index.js';
import { u8aToBn, u8aToBuffer } from '@polkadot/util';
import NodeRSA from 'node-rsa';
export function parseBalance(self, data) {
    const balanceEntry = self.createType('BalanceEntry<BlockNumber>', data);
    // Todo: apply demurrage
    return self.createType('BalanceEntry<BlockNumber>', {
        principal: parseI64F64(balanceEntry.principal),
        last_update: balanceEntry.last_update
    });
}
export function parseBalanceType(data) {
    return parseI64F64(u8aToBn(data));
}
export function parseNodeRSA(data) {
    const keyJson = JSON.parse(data);
    keyJson.n = u8aToBuffer(keyJson.n).reverse();
    keyJson.e = u8aToBuffer(keyJson.e).reverse();
    const key = new NodeRSA();
    setKeyOpts(key);
    key.importKey({
        n: keyJson.n,
        e: keyJson.e
    }, 'components-public');
    return key;
}
function setKeyOpts(key) {
    key.setOptions({
        encryptionScheme: {
            scheme: 'pkcs1_oaep',
            hash: 'sha256',
            label: ''
        }
    });
}