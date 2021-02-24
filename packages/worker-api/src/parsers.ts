import { parseI64F64 } from '@encointer/util';
import { u8aToBn, u8aToBuffer } from '@polkadot/util';
import NodeRSA from 'node-rsa';

import type { IEncointerWorker } from './interface';

export function parseBalance(self: IEncointerWorker, data: any): number {
  const balanceEntry = self.createType('BalanceEntry<u32>', data);
  // Todo: apply demurrage
  return parseI64F64(balanceEntry.principal);
}

export function parseBalanceType (data: any): number {
  return parseI64F64(u8aToBn(data));
}

export function parseNodeRSA (data: any): NodeRSA {
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

function setKeyOpts (key: NodeRSA) {
  key.setOptions(
      {
        encryptionScheme: {
          scheme: 'pkcs1_oaep',
          hash: 'sha256',
          label: ''
        }
      }
  );
}
