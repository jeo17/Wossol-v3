import { eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { db } from '../../db';
import { pricingTypes, insertPricingTypeSchema } from '../../db/schemas';

const pricingTypeRouter = Router();

// Get all Pricing types
pricingTypeRouter.get(
  '/pricing-type',
  asyncHandler(async (req, res) => {
    try {
      let allpricingTypes = await db.select().from(pricingTypes);
      res.status(StatusCodes.OK).json(allpricingTypes);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch pricing typr' });
    }
  }),
);

// Get a single Pricing type by ID
pricingTypeRouter.get(
  '/pricing-type/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const pricingType = await db
        .select()
        .from(pricingTypes)
        .where(eq(pricingTypes.code, id))
        .limit(1);
      if (pricingType.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Pricing type not found' });
      }
      res.status(StatusCodes.OK).json(pricingType[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch Pricing type' });
    }
  }),
);

// Create a new Pricing type
pricingTypeRouter.post(
  '/pricing-type/manage',
  (req, _, next) => {
    // Validate request body using Zod
    insertPricingTypeSchema.parse(req.body.pricingType);
    next();
  },

  asyncHandler(async (req, res) => {
    try {
      const { pricingType } = req.body;

      const insertedPricingType = await db
        .insert(pricingTypes)
        .values(pricingType)
        .returning();
      res.status(StatusCodes.CREATED).json(insertedPricingType);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to create Pricing type' });
    }
  }),
);

// Update an existing Pricing type
pricingTypeRouter.put(
  '/pricing-type/:id',
  (req, _, next) => {
    // Validate request body using Zod
    insertPricingTypeSchema.parse(req.body.pricingType);
    next();
  },
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { pricingType } = req.body;

      const updatedPricingType = await db
        .update(pricingTypes)
        .set(pricingType)
        .where(eq(pricingTypes.code, id))
        .returning();
      if (updatedPricingType.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Pricing type not found' });
      }
      res.status(StatusCodes.OK).json(updatedPricingType[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update Pricing type' });
    }
  }),
);

// Delete an Pricing type
pricingTypeRouter.delete(
  '/pricing-type/:id',
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPricingType = await db
        .delete(pricingTypes)
        .where(eq(pricingTypes.code, id))
        .returning();
      if (deletedPricingType.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Pricing type not found' });
      }
      res.status(StatusCodes.OK).json(deletedPricingType[0]);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to delete Pricing type' });
    }
  }),
);

export default pricingTypeRouter;
