import cookieParser from 'cookie-parser';
import 'dotenv/config'; // using the default export
import express, { json, urlencoded } from 'express';

import adminRouter from './src/routes/admin.ts';
import groupRouter from './src/routes/group.ts';
import roleRouter from './src/routes/role.ts';
import userRouter from './src/routes/user.ts';

import { isAdmin } from './src/middleware/admin.ts';
import { errorHandler } from './src/middleware/error.ts';
import { isAuthenticated } from './src/middleware/parseJwt.ts';
import townRouter from './src/routes//Basic data/town.ts';
import cityRouter from './src/routes/Basic data/city.ts';
import countryRouter from './src/routes/Basic data/country.ts';
import feesStateRouter from './src/routes/Basic data/feesState.ts';
import orderStateRouter from './src/routes/Basic data/orderState.ts';
import pricingTypeRouter from './src/routes/Basic data/pricingType.ts';
import subOrderStateRouter from './src/routes/Basic data/subOrderState.ts';

(async () => {
  const app = express();
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/', (_, res) => {
    res.send('hi');
  });

  // this is only superAdmin routes
  // route for creating a group
  app.use('/groups', groupRouter);
  // route for creating a rule
  app.use('/roles', roleRouter);
  // route for linking group with his rules

  // this is only for admin or superAdmin
  // route for creating a user
  // route for removing a user

  app.use('/', countryRouter);
  app.use('/', cityRouter);
  app.use('/', townRouter);
  app.use('/', feesStateRouter);
  app.use('/', orderStateRouter);
  app.use('/', subOrderStateRouter);
  app.use('/', pricingTypeRouter);

  app.use('/api/v1/users/sign-up', isAuthenticated);
  app.use('/api/v1/users/sign-up', isAdmin);

  app.use('/api/v1/users', userRouter);

  //******* protect the routes below this line ********
  app.use(isAuthenticated);

  app.use('/api/v1/admins', adminRouter);

  app.all('*', (_, res) => {
    res.send('404 this route does not exist');
  });

  app.use(errorHandler);

  app.listen('3000', () =>
    console.log('app is running in http://localhost:3000'),
  );
})();
