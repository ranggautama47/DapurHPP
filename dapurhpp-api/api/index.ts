import { createHandler } from '../src/main.serverless';

let handlerPromise: Promise<import('express').Express>;

export default async function (req: any, res: any) {
  if (!handlerPromise) {
    handlerPromise = createHandler();
  }
  const expressApp = await handlerPromise;
  return expressApp(req, res);
}