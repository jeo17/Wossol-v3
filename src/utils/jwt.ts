import { StatusCodes } from 'http-status-codes';
import { sign, verify } from 'jsonwebtoken';

import { JWTObject } from '../types';
import { AppError } from './AppError';
import { getJwtSecret } from './env';

export function signJwt(payload: JWTObject) {
  try {
    return sign(payload, getJwtSecret(), {
      expiresIn: '30 days',
    });
  } catch (error) {
    throw new AppError({
      description: 'Error signing JWT',
      httpStatus: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}

export function verifyJwt(token: string): JWTObject {
  try {
    const jwt = verify(token, getJwtSecret()) as JWTObject;
    return jwt;
  } catch (error) {
    throw new AppError({
      description: 'Invalid token',
      httpStatus: StatusCodes.UNAUTHORIZED,
    });
  }
}
