import { parseI64F64 } from '@encointer/util';
import { u8aToBn } from '@polkadot/util';

// @ts-ignore
import NodeRSA from '@learntheropes/node-rsa';

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

/**
 * Parse a public key retrieved from the worker into `NodeRsa`.
 *
 * Note: This code is relatively sensitive: Changes here could lead
 * to errors parsing and encryption errors in the browser, probably
 * because of inconsistencies of node's `Buffer and the `buffer`
 * polyfill in browser.
 * @param data
 */
export function parseNodeRSA(data: any): NodeRSA {
  const keyJson = JSON.parse(data);
  keyJson.n = new BN(keyJson.n, 'le');
  keyJson.e = new BN(keyJson.e);
  const key = new NodeRSA();
  setKeyOpts(key);
  key.importKey({
    // Important: use string here, not buffer, otherwise the browser will
    // misinterpret the `n`.
    n: keyJson.n.toString(10),
    // Important: use number here, not buffer, otherwise the browser will
    // misinterpret the `e`.
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
