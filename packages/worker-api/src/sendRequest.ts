import {
  type IWorker,
  type RequestArgs,
  type RequestOptions,
  type WorkerMethod,
  createJsonRpcRequest
} from './interface.js';
import  { Request } from './interface.js';

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

