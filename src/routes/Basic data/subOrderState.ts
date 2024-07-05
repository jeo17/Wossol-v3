import { eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { db } from '../../db';
import { insertSubOrderStateSchema, subOrderStates } from '../../db/schemas';

const subOrderStateRouter = Router();

// Get all sub order states
subOrderStateRouter.get(
  '/sub-order-states',
  asyncHandler(async (_, res) => {
    try {
      let allSubOrderStates = await db.select().from(subOrderStates);
      res.status(StatusCodes.OK).json(allSubOrderStates);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch sub order states' });
    }
  }),
);

// Get a single sub order state by ID
subOrderStateRouter.get(
  '/sub-order-states/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const subOrderState = await db
        .select()
        .from(subOrderStates)
        .where(eq(subOrderStates.code, id))
        .limit(1);
      if (subOrderState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Sub order state not found' });
      }
      res.status(StatusCodes.OK).json(subOrderState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch sub order state' });
    }
  }),
);

// Create a new sub order state
subOrderStateRouter.post(
  '/sub-order-states/manage',
  (req, _, next) => {
    // Validate request body using Zod
    z
      .string()
      .min(1, { message: 'order state code cannot be empty' })
      .parse(req.body.orderStateCode),
      insertSubOrderStateSchema.parse(req.body.subOrderState);

    next();
  },
  asyncHandler(async (req, res) => {
    try {
      const { subOrderState, orderStateCode } = req.body;

      const insertedSubOrderState = await db
        .insert(subOrderStates)
        .values({ ...subOrderState, orderStateCode })
        .returning();
      res.status(StatusCodes.CREATED).json(insertedSubOrderState);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to create sub order state' });
    }
  }),
);

// Update an existing sub order state
subOrderStateRouter.put(
  '/sub-order-states/:id',
  (req, _, next) => {
    // Validate request body using Zod

    insertSubOrderStateSchema.parse(req.body.subOrderState);

    next();
  },
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { subOrderState } = req.body;

      const updatedSubOrderState = await db
        .update(subOrderStates)
        .set(subOrderState)
        .where(eq(subOrderStates.code, id))
        .returning();
      if (updatedSubOrderState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Sub order state not found' });
      }
      res.status(StatusCodes.OK).json(updatedSubOrderState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update sub order state' });
    }
  }),
);

// Delete a sub order state
subOrderStateRouter.delete(
  '/sub-order-states/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSubOrderState = await db
        .delete(subOrderStates)
        .where(eq(subOrderStates.code, id))
        .returning();
      if (deletedSubOrderState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Sub order state not found' });
      }
      res.status(StatusCodes.OK).json(deletedSubOrderState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to delete sub order state' });
    }
  }),
);

subOrderStateRouter.get(
  '/sub-order-states/by-order/:orderCode',
  asyncHandler(async (req, res) => {
    try {
      const { orderCode } = req.params;
      const subOrderStatesByOrder = await db
        .select()
        .from(subOrderStates)
        .where(eq(subOrderStates.orderStateCode, orderCode));

      res.status(StatusCodes.OK).json(subOrderStatesByOrder);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch sub order states by order code' });
    }
  }),
);

export default subOrderStateRouter;
