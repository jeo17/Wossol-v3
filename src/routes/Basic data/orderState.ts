import { eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { db } from '../../db';
import { insertOrderStateSchema, orderStates } from '../../db/schemas';

const orderStateRouter = Router();

// Get all order states
orderStateRouter.get(
  '/order-states',
  asyncHandler(async (req, res) => {
    try {
      let allOrderStates = await db.select().from(orderStates);
      res.status(StatusCodes.OK).json(allOrderStates);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch order States' });
    }
  }),
);

// Get a single order state by ID
orderStateRouter.get(
  '/order-states/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const orderState = await db
        .select()
        .from(orderStates)
        .where(eq(orderStates.code, id))
        .limit(1);
      if (orderState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Order state not found' });
      }
      res.status(StatusCodes.OK).json(orderState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch order state' });
    }
  }),
);

// Create a new order state
orderStateRouter.post(
  '/order-states/manage',
  (req, _, next) => {
    // Validate request body using Zod
    insertOrderStateSchema.parse(req.body.orderState);
    next();
  },

  asyncHandler(async (req, res) => {
    try {
      const { orderState } = req.body;

      const insertedOrderState = await db
        .insert(orderStates)
        .values(orderState)
        .returning();
      res.status(StatusCodes.CREATED).json(insertedOrderState);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to create order state' });
    }
  }),
);

// Update an existing order state
orderStateRouter.put(
  '/order-states/:id',
  (req, _, next) => {
    // Validate request body using Zod
    insertOrderStateSchema.parse(req.body.orderState);
    next();
  },
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { orderState } = req.body;

      const updatedOrderState = await db
        .update(orderStates)
        .set(orderState)
        .where(eq(orderStates.code, id))
        .returning();
      if (updatedOrderState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Order state not found' });
      }
      res.status(StatusCodes.OK).json(updatedOrderState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update order state' });
    }
  }),
);

// Delete an order state
orderStateRouter.delete(
  '/order-states/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedOrderState = await db
        .delete(orderStates)
        .where(eq(orderStates.code, id))
        .returning();
      if (deletedOrderState.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Order state not found' });
      }
      res.status(StatusCodes.OK).json(deletedOrderState[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to delete order state' });
    }
  }),
);

export default orderStateRouter;
