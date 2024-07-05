import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { isAdmin } from '../middleware/admin';
import { AppError } from '../utils/AppError';

const adminRoute = Router();

adminRoute.use(isAdmin);

adminRoute.post(
  '/user',
  (req, _, next) => {
    if (req.body.userType === 'super_admin') {
      throw new AppError({
        description: 'admin can only create admin or seller',
        httpStatus: StatusCodes.FORBIDDEN,
      });
    }
    return next();
  },
  (_, res) => {
    return res.redirect('/api/v1/auth/sign-up');
  },
);

export default adminRoute;
