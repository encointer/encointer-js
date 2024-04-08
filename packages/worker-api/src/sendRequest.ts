import {
  type IEncointerWorker,
  type TrustedGetterArgs,
  type PublicGetterArgs,
  type RequestArgs,
  type CallOptions,
  type WorkerMethod,
  createJsonRpcRequest
} from './interface.js';
import  { Request } from './interface.js';
import {
  clientRequestGetter,
  clientRequestTrustedGetter,
} from "@encointer/worker-api/requests.js";
import type {ShardIdentifier, TrustedCallSigned} from "@encointer/types";

const sendWorkerRequest = (self: IEncointerWorker, clientRequest: any, parserType: string, options: CallOptions): Promise<any> =>{
  const requestId = self.rqStack.push(parserType) + self.rsCount;
  return self.sendRequest(
    clientRequest, {
      timeout: options.timeout,
      requestId
    }
  )
}

const sendTrustedGetterRequest = (self: IEncointerWorker, method: string, parser: string, args: TrustedGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestTrustedGetter(self, method, args), parser, options)

const sendPublicGetterRequest = (self: IEncointerWorker, method: string, parser: string, args: PublicGetterArgs, options: CallOptions) =>
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
      result = sendTrustedGetterRequest(self, method, parserType, args as TrustedGetterArgs, options)
      break;
    case Request.PublicGetter:
      result = sendPublicGetterRequest(self, method, parserType, args as PublicGetterArgs, options)
      break;
    case Request.Worker:
      result = sendWorkerRequest(self, createJsonRpcRequest(method, [], 1), parserType, options)
      break;
    default:
      result = sendPublicGetterRequest(self, method, parserType, args as PublicGetterArgs, options)
      break;
  }
  return result as Promise<T>
}

export const sendTrustedCall = async <T>(self: IEncointerWorker, call: TrustedCallSigned, shard: ShardIdentifier, direct: boolean, parser: string, options: CallOptions = {} as CallOptions): Promise<T> => {
  if( !self.isOpened ) {
    await self.open();
  }

  let result: Promise<any>;
  let parserType: string = options.debug ? 'raw': parser;

  console.log(`TrustedCall: ${JSON.stringify(call)}`);

  let top;
  if (direct) {
    top = self.createType('TrustedOperation', {
      direct_call: call
    })
  } else {
    top = self.createType('TrustedOperation', {
      indirect_call: call
    })
  }

  const cyphertext = self.encrypt(top.toU8a());

  const r = self.createType(
      'Request', { shard, cyphertext: cyphertext }
  );

  result = sendWorkerRequest(self, createJsonRpcRequest('author_submitExtrinsic', [r.toHex()], 1), parserType, options)
  return result as Promise<T>
}

