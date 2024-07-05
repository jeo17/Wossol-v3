import { eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { db } from '../../db';
import { feesStates, insertFeesStateSchema } from '../../db/schemas';

const feesStateRouter = Router();

// Get all fees states
feesStateRouter.get(
  '/fees-states',
  asyncHandler(async (req, res) => {
    try {
      let allFeesStates = await db.select().from(feesStates);
      res.status(StatusCodes.OK).json(allFeesStates);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch fees States' });
    }
  }),
);

// Get a single fees state by ID
feesStateRouter.get(
  '/fees-states/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const feesState = await db
        .select()
        .from(feesStates)
        .where(eq(feesStates.code, id))
        .limit(1);
      if (feesState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'fees state not found' });
      }
      res.status(StatusCodes.OK).json(feesState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch fees state' });
    }
  }),
);

// Create a new fees state
feesStateRouter.post(
  '/fees-states/manage',
  (req, _, next) => {
    // Validate request body using Zod
    insertFeesStateSchema.parse(req.body.feesState);
    next();
  },

  asyncHandler(async (req, res) => {
    try {
      const { feesState } = req.body;

      const insertedFeesState = await db
        .insert(feesStates)
        .values(feesState)
        .returning();
      res.status(StatusCodes.CREATED).json(insertedFeesState);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to create fees state' });
    }
  }),
);

// Update an existing fees state
feesStateRouter.put(
  '/fees-states/:id',
  (req, _, next) => {
    // Validate request body using Zod
    insertFeesStateSchema.parse(req.body.feesState);
    next();
  },
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { feesState } = req.body;

      const updatedFeesState = await db
        .update(feesStates)
        .set(feesState)
        .where(eq(feesStates.code, id))
        .returning();
      if (updatedFeesState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'fees state not found' });
      }
      res.status(StatusCodes.OK).json(updatedFeesState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update fees state' });
    }
  }),
);

// Delete an fees state
feesStateRouter.delete(
  '/fees-states/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedFeesState = await db
        .delete(feesStates)
        .where(eq(feesStates.code, id))
        .returning();
      if (deletedFeesState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'fees state not found' });
      }
      res.status(StatusCodes.OK).json(deletedFeesState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to delete fees state' });
    }
  }),
);

export default feesStateRouter;
