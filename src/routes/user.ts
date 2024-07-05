import { eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { SignInRequest, SignInResponse, SignUpRequest } from '../api';
import { db } from '../db';
import { insertUserSchema, users } from '../db/schemas';
import { AppError } from '../utils/AppError';
import { signJwt } from '../utils/jwt';
import { hashPassword } from '../utils/password';
import { ExpressHandler } from './../types';

const userRouter = Router();

userRouter.post<ExpressHandler<SignUpRequest, {}>>(
  '/sign-up',
  (req, _, next) => {
    // if the parse crashed will trigger the error handler middleware
    insertUserSchema.parse(req.body);
    next();
  },
  asyncHandler(async (req, res) => {
    if (
      res.locals.userType === 'admin' &&
      req.body.userType === 'super_admin'
    ) {
      throw new AppError({
        description: 'admin can only create admin or seller',
        httpStatus: StatusCodes.FORBIDDEN,
      });
    }
    const { password } = req.body;
    const hashedPassword = hashPassword(password);
    // if the parse crashed will trigger the error handler middleware
    await db.insert(users).values({ ...req.body, password: hashedPassword });
    res.status(StatusCodes.CREATED).send('User created');
  }),
);

const signInSchema = insertUserSchema.pick({ email: true, password: true });

userRouter.post<ExpressHandler<SignInRequest, SignInResponse>>(
  '/sign-in',
  (req, _, next) => {
    // if the parse crashed will trigger the error handler middleware
    signInSchema.parse(req.body);
    next();
  },
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0]) {
      throw new AppError({
        description: 'User not found',
        httpStatus: StatusCodes.BAD_REQUEST,
      });
    }

    const hashedPassword = hashPassword(password);

    if (user[0].password !== hashedPassword) {
      throw new AppError({
        description: 'Invalid password',
        httpStatus: StatusCodes.BAD_REQUEST,
      });
    }

    const jwt = signJwt({
      userId: user[0].uuid,
      userType: user[0].userType,
    });

    //res.setHeader('Authorization', `Bearer ${jwt}`);
    res.cookie('jwt', `Bearer ${jwt}`, { httpOnly: true, maxAge: 86400000 });

    res.status(StatusCodes.OK).send({
      userId: user[0].uuid,
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      email: user[0].email,
    });
  }),
);

export default userRouter;
