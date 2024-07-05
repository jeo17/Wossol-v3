import { RequestHandler } from 'express';

export type JWTObject = {
  userId: string;
  userType: string;
};
export type ExpressHandler<Req, Res> = RequestHandler<
  string,
  Partial<Res>,
  Partial<Req>,
  any
>;
export type ExpressHandlerWithParams<Params, Req, Res> = RequestHandler<
  Partial<Params>,
  Partial<Res>,
  Partial<Req>,
  any
>;
