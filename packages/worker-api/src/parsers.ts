import { parseI64F64 } from '@encointer/util';
import { u8aToBn, u8aToBuffer } from '@polkadot/util';

// @ts-ignore
import NodeRSA from 'node-rsa';

import type { IWorker } from './interface.js';
import type { BalanceEntry } from "@encointer/types";
import BN from "bn.js";

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

export function parseNodeRSA(data: any): NodeRSA {
  const keyJson = JSON.parse(data);
  keyJson.n = u8aToBuffer(keyJson.n).reverse();
  keyJson.e = new BN(keyJson.e);
  const key = new NodeRSA();
  setKeyOpts(key);
  key.importKey({
    n: keyJson.n,
    e: keyJson.e.toNumber()
  }, 'components-public');
  return key;
}

function setKeyOpts(key: NodeRSA) {
  key.setOptions(
    {
      // Enforce using the pure javascript implementations by
      // setting the `browser` environment, as compatibility
      // with node's crypto is broken and leads to bad outputs.
      environment: 'browser',
      encryptionScheme: {
        scheme: 'pkcs1_oaep',
        hash: 'sha256',
        label: ''
      }
    }
  );
}
