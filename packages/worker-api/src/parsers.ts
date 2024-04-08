import { parseI64F64 } from '@encointer/util';
import { u8aToBn, u8aToBuffer } from '@polkadot/util';

// @ts-ignore
import NodeRSA from 'node-rsa';

import type { IEncointerWorker } from './interface.js';
import type { BalanceEntry } from "@encointer/types";

export function parseBalance(self: IEncointerWorker, data: any): BalanceEntry {
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

export function parseNodeRSA(data: any): NodeRSA {
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

function setKeyOpts(key: NodeRSA) {
  key.setOptions(
    {
      environment: 'browser',
      encryptionScheme: {
        scheme: 'pkcs1_oaep',
        hash: 'sha256',
        label: ''
      }
    }
  );
}
