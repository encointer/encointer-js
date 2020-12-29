import * as bs58 from 'bs58';
import { u8aToHex } from '@polkadot/util';

import type { IEncointerWorker, TrustedGetterArgs, PublicGetterArgs, GetterArgs, CallOptions, WorkerMethod } from './interface';
import  { GetterType } from './interface';

const sendWorkerRequest = (self: IEncointerWorker, clientRequest: any, parserType: string, options: CallOptions): Promise<any> =>
  self.sendRequest(
  clientRequest, {
    timeout: options.timeout,
    requestId: self.rqStack.push(parserType) + self.rsCount
  }
);

const clientRequestGetter = (self: IEncointerWorker, request: string, args: PublicGetterArgs) => {
  const {cid}=args;
  const cidBin = u8aToHex(bs58.decode(cid));
  const getter = self.createType('PublicGetter', {
    [request]: cidBin
  });
  return {
    StfState: [{ public: getter }, cidBin]
  }
}
const requestParams = (self: IEncointerWorker, address: string, shard: string) =>
  self.createType('(AccountId, CurrencyIdentifier)', [address, shard]);

const clientRequestTrustedGetter = (self: IEncointerWorker, request: string, args: TrustedGetterArgs) => {
  const {cid, account} = args;
  const address = account.address;
  const cidBin = u8aToHex(bs58.decode(cid));
  const getter = self.createType('TrustedGetter', {
    [request]: requestParams(self, address, cidBin)
  });
  const signature = account.sign(getter.toU8a());
  return {
    StfState: [
      {
        trusted: {
          getter,
          signature
        }
      },
      cidBin
    ]
  }
}

const sendTrustedRequest = (self: IEncointerWorker, method: string, parser: string, args: PublicGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestGetter(self, method, args), parser, options)

const sendPublicRequest = (self: IEncointerWorker, method: string, parser: string, args: TrustedGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestTrustedGetter(self, method, args), parser, options)

export const callGetter = async <T>(self: IEncointerWorker, workerMethod: WorkerMethod, args: GetterArgs, options: CallOptions = {} as CallOptions): Promise<T> => {
  await self.apiPromise;
  const [getterType, method, parser] = workerMethod;
  let result: Promise<any>;
  switch (getterType) {
    case GetterType.Trusted:
      result = sendTrustedRequest(self, method, parser, args, options)
    case GetterType.Public:
      result = sendPublicRequest(self, method, parser, args as TrustedGetterArgs, options)
    default:
      result = sendPublicRequest(self, method, parser, args as TrustedGetterArgs, options)
  }
  return result as Promise<T>
}
