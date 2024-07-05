import { eq, inArray } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import { CreateGroupRequest, InsertRoleToGroupRequest } from '../api';
import { db } from '../db';
import {
  groups,
  groupsRoles,
  groupsUsers,
  insertGroupSchema,
  insertGroupsUsersSchema,
  roles,
  users,
} from '../db/schemas';

import { ExpressHandler } from './../types';
import { AppError } from './../utils/AppError';

const groupRouter = Router();

// Route to list all groups
groupRouter.get(
  '/',

  async (_, res) => {

    // Fetch all groups from the database
    const allGroups = await db.select().from(groups);

    // Respond with the list of groups
    res.status(StatusCodes.OK).send(allGroups);
  },
);

// Route to get a group by name
groupRouter.get(
  '/:groupName',
  (req, _, next) => {
    // Validate request parameters using Zod
    z.string().parse(req.params.groupName);
    next();
  },
  asyncHandler(async (req, res) => {
    const { groupName } = req.params;
    // Fetch all groups from the database
    const groups = await db.query.groups.findMany({
      where(fields) {
        return eq(fields.name, groupName);
      },
    });

    // Respond with the list of groups
    res.status(StatusCodes.OK).send(groups);
  }),
);

// Route to delete a group by name
groupRouter.delete(
  '/:groupName',
  (req, _, next) => {
    // Validate request parameters using Zod
    z.string().parse(req.params.groupName);
    next();
  },
  asyncHandler(async (req, res) => {
    const { groupName } = req.params;
    // Fetch all groups from the database
    const deletedGroup = await db
      .delete(groups)
      .where(eq(groups.name, groupName))
      .returning();
    // Respond with the list of groups
    res.status(StatusCodes.OK).send(deletedGroup);
  }),
);

// Route to update a group by name
groupRouter.put(
  '/:groupName',
  (req, _, next) => {
    // Validate request parameters using Zod
    z.string().parse(req.params.groupName);
    next();
  },
  asyncHandler(async (req, res) => {
    const { groupName } = req.params;
    // Fetch all groups from the database
    const updatedGroup = await db
      .update(groups)
      .set({
        ...req.body,
      })
      .where(eq(groups.name, groupName))
      .returning();
    // Respond with the list of groups
    res.status(StatusCodes.OK).send(updatedGroup);
  }),
);

// Route to insert a new group
groupRouter.post<ExpressHandler<CreateGroupRequest, {}>>(
  '/',
  (req, _, next) => {
    // Validate request body using Zod
    insertGroupSchema.parse(req.body);
    next();
  },
  asyncHandler(async (req, res) => {
    // Insert the new group into the database
    await db.insert(groups).values({
      ...req.body,
    });

    // Respond with the new group
    res.status(StatusCodes.CREATED).send('group created');
  }),
);

export const insertRoleToGroupSchema = z.object({
  // groupName: insertGroupSchema.pick({ name: true }),
  groupName: z.string(),
  roleName: z.string().array(),
  // roleName: insertRoleSchema.pick({ name: true }),
});

// Route to insert a new role to a group
groupRouter.post<ExpressHandler<InsertRoleToGroupRequest, {}>>(
  '/roles',
  (req, _, next) => {
    // Validate request body using Zod
    insertRoleToGroupSchema.parse(req.body);
    next();
  },

  asyncHandler(async (req, res) => {
    const { groupName, roleName } = req.body;
    // Check if the group exists
    const groupExists = await db
      .select()
      .from(groups)
      .where(eq(groups.name, groupName));

    if (groupExists.length === 0) {
      throw new AppError({
        httpStatus: StatusCodes.NOT_FOUND,
        description: 'Group not found',
      });
    }

    // Check if all roles exist

    const rolesExist = await db
      .select()
      .from(roles)
      .where(inArray(roles.name, roleName));

    if (rolesExist.length !== roleName.length) {
      console.log(rolesExist.length, roleName.length);
      throw new AppError({
        httpStatus: StatusCodes.NOT_FOUND,
        description: 'One or more roles not found',
      });
    }

    for (const role of rolesExist) {
      await db.insert(groupsRoles).values({
        groupName: groupName,
        roleName: role.name,
      });
    }

    res.status(StatusCodes.CREATED).send('Roles added to group');
  }),
);

// Route to insert a new user to a group

groupRouter.post(
  '/users',
  (req, _, next) => {
    // Validate request body using Zod
    insertGroupsUsersSchema.parse(req.body);
    next();
  },
  async (req, res) => {
    const { groupName, userId } = req.body as z.infer<
      typeof insertGroupsUsersSchema
    >;

    // Check if the group exists
    const groupExists = await db
      .select()
      .from(groups)
      .where(eq(groups.name, groupName))
      .limit(1);

    if (groupExists.length === 0) {
      throw new AppError({
        httpStatus: StatusCodes.NOT_FOUND,
        description: 'Group not found',
      });
    }

    // Check if all users exist
    const usersExist = await db
      .select()
      .from(users)
      .where(inArray(users.uuid, userId));

    if (usersExist.length !== userId.length) {
      throw new AppError({
        httpStatus: StatusCodes.NOT_FOUND,
        description: 'One or more users not found',
      });
    }

    // Insert the users into the group
    const values = usersExist.map((user) => ({
      groupName,
      userId: user.uuid,
    }));

    await db.insert(groupsUsers).values(values);

    // Respond with success message
    res.status(201).send('Users added to group');
  },
);

export default groupRouter;
