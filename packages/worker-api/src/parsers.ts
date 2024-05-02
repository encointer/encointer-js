import {parseI64F64} from '@encointer/util';
import {u8aToBn} from '@polkadot/util';

import type {IWorker} from './interface.js';
import type {BalanceEntry} from "@encointer/types";

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


