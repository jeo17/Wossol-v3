import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '../utils/AppError';

export const isAdmin: RequestHandler = (_, res, next) => {
  if (!res.locals) {
    throw new AppError({
      description: 'No user found in request',
      httpStatus: StatusCodes.UNAUTHORIZED,
    });
  }

  if (res.locals.userType !== 'admin' && res.locals.userType !== 'super_admin' ) {
    throw new AppError({
      description: 'User is not an authorized',
      httpStatus: StatusCodes.UNAUTHORIZED,
    });
  }
   console.log(res.locals)
  next();
};
