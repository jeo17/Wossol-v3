import { and, eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { db } from '../../db';
import { cities, insertCitySchema, towns } from '../../db/schemas';

const townRouter = Router();


townRouter.get(
  '/towns',
  asyncHandler(async (req, res) => {
    try {
      let allTowns = await db.select().from(towns);
      res.status(StatusCodes.OK).json(allTowns);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch towns' });
    }
  }),
);

// Route to manage towns by a given country and city (add or delete town)
townRouter.post(
  '/towns/manage',
  (req, _, next) => {
    // Validate request body using Zod
    z.enum(['create', 'delete']).parse(req.body.operation),
      z
        .string()
        .min(1, { message: 'countryId cannot be empty' })
        .parse(req.body.countryCode),
      z
        .string()
        .min(1, { message: 'cityId cannot be empty' })
        .parse(req.body.cityCode),
      insertCitySchema.parse(req.body.town);

    next();
  },

  asyncHandler(async (req, res) => {
    const { countryCode, cityCode, town, operation } = req.body;

    try {
      // Check if the city belongs to the given country
      const cityInstance = await db
        .select()
        .from(cities)
        .where(and(eq(cities.code, cityCode), eq(cities.countryCode, countryCode)))
        .then((rows) => rows[0]);

      if (!cityInstance) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: 'City not found in the given country' });
      }

      if (operation === 'create') {
        const townInstance = await db
          .insert(towns)
          .values({ ...town, cityCode: cityInstance.code })
          .returning()
          .then((rows) => rows[0]);

        res
          .status(StatusCodes.CREATED)
          .json({ message: 'Town added', town: townInstance });
      } else if (operation === 'delete') {
        await db
          .delete(towns)
          .where(and(eq(towns.code, town.code), eq(towns.cityCode, cityCode)));
        res.status(StatusCodes.OK).json({ message: 'Town deleted' });
      }
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Operation failed', error: error.message });
    }
  }),
);

export default townRouter;
