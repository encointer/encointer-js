import type { IEncointerWorker, TrustedGetterArgs, PublicGetterArgs, RequestArgs, CallOptions, WorkerMethod } from './interface.js';
import  { Request } from './interface.js';

const sendWorkerRequest = (self: IEncointerWorker, clientRequest: any, parserType: string, options: CallOptions): Promise<any> =>{
  const requestId = self.rqStack.push(parserType) + self.rsCount;
  return self.sendRequest(
    clientRequest, {
      timeout: options.timeout,
      requestId
    }
  )
}

const clientRequest = (self: IEncointerWorker, request: string) => {
  return self.createType( 'ClientRequest', {
    [request]: null
  });
}

const clientRequestGetter = (self: IEncointerWorker, request: string, args: PublicGetterArgs) => {
  const { cid } = args;
  const getter = self.createType('PublicGetter', {
    [request]: cid
  });
  return {
    StfState: [{ public: getter }, cid]
  }
}
const requestParams = (self: IEncointerWorker, address: string, shard: string) =>
  self.createType('(AccountId, CommunityIdentifier)', [address, shard]);

const clientRequestTrustedGetter = (self: IEncointerWorker, request: string, args: TrustedGetterArgs) => {
  const {cid, account} = args;
  const address = account.address;
  const getter = self.createType('TrustedGetter', {
    [request]: requestParams(self, address, cid)
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
      cid
    ]
  }
}

const sendTrustedRequest = (self: IEncointerWorker, method: string, parser: string, args: TrustedGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestTrustedGetter(self, method, args), parser, options)

const sendPublicRequest = (self: IEncointerWorker, method: string, parser: string, args: PublicGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestGetter(self, method, args), parser, options)

export const callGetter = async <T>(self: IEncointerWorker, workerMethod: WorkerMethod, args: RequestArgs, options: CallOptions = {} as CallOptions): Promise<T> => {
  if( !self.isOpened ) {
    await self.open();
  }
  const [getterType, method, parser] = workerMethod;
  let result: Promise<any>;
  let parserType: string = options.debug ? 'raw': parser;
  switch (getterType) {
    case Request.TrustedGetter:
      result = sendTrustedRequest(self, method, parserType, args as TrustedGetterArgs, options)
      break;
    case Request.PublicGetter:
      result = sendPublicRequest(self, method, parserType, args as PublicGetterArgs, options)
      break;
    case Request.Worker:
      result = sendWorkerRequest(self, clientRequest(self, method), parserType, options)
      break;
    default:
      result = sendPublicRequest(self, method, parserType, args as PublicGetterArgs, options)
      break;
  }
  return result as Promise<T>
}
