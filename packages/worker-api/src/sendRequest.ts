import {
  type IWorker,
  type RequestArgs,
  type RequestOptions,
  type WorkerMethod,
  createJsonRpcRequest
} from './interface.js';
import  { Request } from './interface.js';
import type {ShardIdentifier, IntegriteeTrustedCallSigned} from "@encointer/types";

export const sendWorkerRequest = async (self: IWorker, clientRequest: any, parserType: string, options?: RequestOptions): Promise<any> =>{
  if( !self.isOpened ) {
    await self.open();
  }

  const requestId = self.rqStack.push(parserType) + self.rsCount;
  const timeout = options && options.timeout ? options.timeout : undefined;
  return self.sendRequest(
    clientRequest, {
      timeout: timeout,
      requestId
    }
  )
}

export const callGetter = async <T>(self: IWorker, workerMethod: WorkerMethod, _args: RequestArgs, requestOptions?: RequestOptions): Promise<T> => {
  const [getterType, method, parser] = workerMethod;
  let result: Promise<any>;
  let parserType: string = requestOptions?.debug ? 'raw': parser;
  switch (getterType) {
    case Request.Worker:
      result = sendWorkerRequest(self, createJsonRpcRequest(method, [], 1), parserType, requestOptions)
      break;
    default:
      throw "Invalid request variant, public and trusted have been removed for the integritee worker"
  }
  return result as Promise<T>
}

export const sendTrustedCall = async <T>(self: IWorker, call: IntegriteeTrustedCallSigned, shard: ShardIdentifier, direct: boolean, parser: string, options: RequestOptions = {} as RequestOptions): Promise<T> => {
  let result: Promise<any>;
  let parserType: string = options.debug ? 'raw': parser;

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

  console.debug(`Sending TrustedOperation: ${JSON.stringify(top)}`);

  const cyphertext = await self.encrypt(top.toU8a());

  const r = self.createType(
      'Request', { shard, cyphertext: cyphertext }
  );

  const rpc = createJsonRpcRequest('author_submitExtrinsic', [r.toHex()], 1);
  result = sendWorkerRequest(self, rpc, parserType, options)

  console.debug(`[sendTrustedCall] sent request: ${JSON.stringify(rpc)}`);

  return result as Promise<T>
}

