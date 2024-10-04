import {
  type IWorker,
  type TrustedGetterArgs,
  type PublicGetterArgs,
  type RequestArgs,
  type RequestOptions,
  type WorkerMethod,
  createJsonRpcRequest
} from './interface.js';
import  { Request } from './interface.js';
import {
  clientRequestGetterRpc,
  clientRequestTrustedGetterRpc,
} from "./requests.js";
import type {ShardIdentifier, IntegriteeTrustedCallSigned} from "@encointer/types";

export const sendWorkerRequest = (self: IWorker, clientRequest: any, parserType: string, options?: RequestOptions): Promise<any> =>{
  const requestId = self.rqStack.push(parserType) + self.rsCount;
  const timeout = options && options.timeout ? options.timeout : undefined;
  return self.sendRequest(
    clientRequest, {
      timeout: timeout,
      requestId
    }
  )
}

const sendTrustedGetterRequest = async (self: IWorker, method: string, parser: string, args: TrustedGetterArgs, options?: RequestOptions) =>
  sendWorkerRequest(self, await clientRequestTrustedGetterRpc(self, method, args), parser, options)

const sendPublicGetterRequest = (self: IWorker, method: string, parser: string, args: PublicGetterArgs, options?: RequestOptions) =>
  sendWorkerRequest(self, clientRequestGetterRpc(self, method, args), parser, options)

export const callGetter = async <T>(self: IWorker, workerMethod: WorkerMethod, args: RequestArgs, requestOptions?: RequestOptions): Promise<T> => {
  if( !self.isOpened ) {
    await self.open();
  }
  const [getterType, method, parser] = workerMethod;
  let result: Promise<any>;
  let parserType: string = requestOptions?.debug ? 'raw': parser;
  switch (getterType) {
    case Request.TrustedGetter:
      result = sendTrustedGetterRequest(self, method, parserType, args as TrustedGetterArgs, requestOptions)
      break;
    case Request.PublicGetter:
      result = sendPublicGetterRequest(self, method, parserType, args as PublicGetterArgs, requestOptions)
      break;
    case Request.Worker:
      result = sendWorkerRequest(self, createJsonRpcRequest(method, [], 1), parserType, requestOptions)
      break;
    default:
      result = sendPublicGetterRequest(self, method, parserType, args as PublicGetterArgs, requestOptions)
      break;
  }
  return result as Promise<T>
}

export const sendTrustedCall = async <T>(self: IWorker, call: IntegriteeTrustedCallSigned, shard: ShardIdentifier, direct: boolean, parser: string, options: RequestOptions = {} as RequestOptions): Promise<T> => {
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

