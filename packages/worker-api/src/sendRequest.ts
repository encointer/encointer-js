import {
  type IWorker,
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
} from "./requests.js";
import type {ShardIdentifier, IntegriteeTrustedCallSigned} from "@encointer/types";

const sendWorkerRequest = (self: IWorker, clientRequest: any, parserType: string, options: CallOptions): Promise<any> =>{
  const requestId = self.rqStack.push(parserType) + self.rsCount;
  return self.sendRequest(
    clientRequest, {
      timeout: options.timeout,
      requestId
    }
  )
}

const sendTrustedGetterRequest = (self: IWorker, method: string, parser: string, args: TrustedGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestTrustedGetter(self, method, args), parser, options)

const sendPublicGetterRequest = (self: IWorker, method: string, parser: string, args: PublicGetterArgs, options: CallOptions) =>
  sendWorkerRequest(self, clientRequestGetter(self, method, args), parser, options)

export const callGetter = async <T>(self: IWorker, workerMethod: WorkerMethod, args: RequestArgs, options: CallOptions = {} as CallOptions): Promise<T> => {
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

export const sendTrustedCall = async <T>(self: IWorker, call: IntegriteeTrustedCallSigned, shard: ShardIdentifier, direct: boolean, parser: string, options: CallOptions = {} as CallOptions): Promise<T> => {
  if( !self.isOpened ) {
    await self.open();
  }

  let result: Promise<any>;
  let parserType: string = options.debug ? 'raw': parser;

  // console.log(`TrustedCall: ${JSON.stringify(call)}`);

  let top;
  if (direct) {
    top = self.createType('IntegriteeTrustedOperation', {
      direct_call: call
    })
  } else {
    top = self.createType('IntegriteeTrustedOperation', {
      indirect_call: call
    })
  }

  console.log(`TrustedOperation: ${JSON.stringify(top)}`);

  const cyphertext = await self.encrypt(top.toU8a());

  const r = self.createType(
      'Request', { shard, cyphertext: cyphertext }
  );

  const rpc = createJsonRpcRequest('author_submitExtrinsic', [r.toHex()], 1);
  result = sendWorkerRequest(self, rpc, parserType, options)

  console.log(`[sendTrustedCall] sent request: ${JSON.stringify(rpc)}`);

  return result as Promise<T>
}

