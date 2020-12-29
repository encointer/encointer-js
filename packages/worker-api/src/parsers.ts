import { parseI64F64 } from '@encointer/util';
import { u8aToBn } from '@polkadot/util';

import type { IEncointerWorker } from './interface';

export function parseBalance(self: IEncointerWorker, data: any): number {
  const balanceEntry = self.createType('BalanceEntry<u32>', data);
  // Todo: apply demurrage
  return parseI64F64(balanceEntry.principal);
};

export function parseBalanceType (data: any): number {
  return parseI64F64(u8aToBn(data));
};
