import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import { AppError } from '../utils/AppError';

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Validation error',
      details: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.httpStatus).json({
      error: err.message,
      description: err.description,
    });
  }

  // Generic error handler for all other errors
  return res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
};
