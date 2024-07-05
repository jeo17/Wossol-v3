import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';

import { CreateRoleRequest } from '../api';
import { ExpressHandler } from './../types';
import { db } from '../db';
import { insertRoleSchema, roles as rolesTable } from '../db/schemas';

const createRoles = Router();

// Route to insert a new role
createRoles.post<ExpressHandler<CreateRoleRequest, {}>>(
  '/',
  (req, _, next) => {
    // Validate request body using Zod
    insertRoleSchema.parse(req.body);
    next();
  },
  asyncHandler(async (req, res) => {
    // Insert the new role into the database
    await db.insert(rolesTable).values({
      ...req.body,
    });

    // Respond with the new role
    res.status(StatusCodes.CREATED).send('role created');
  }),
);

createRoles.get(
  '/roles',
  asyncHandler(async (_, res) => {
    const roles = await db.select().from(rolesTable);
    res.status(StatusCodes.OK).send(roles);
  }),
);

export default createRoles;
