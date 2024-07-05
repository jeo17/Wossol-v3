import { and, eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { db } from '../../db';
import {
  cities,
  insertCitySchema,
  insertTownSchema,
  towns,
} from '../../db/schemas';

const cityRouter = Router();

cityRouter.get(
  '/cities',
  asyncHandler(async (req, res) => {
    try {
      let allCities = await db.select().from(cities);
      res.status(StatusCodes.OK).json(allCities);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch cities' });
    }
  }),
);

// Route to manage cities by a given country (add or delete city)
cityRouter.post(
  '/cities/manage',
  (req, _, next) => {
    // Validate request body using Zod
    z.enum(['create', 'delete']).parse(req.body.operation),
      z
        .string()
        .min(1, { message: 'countryCode cannot be empty' })
        .parse(req.body.countryCode),
      insertCitySchema.parse(req.body.city);
    if (req.body.operation === 'create') {
      z.array(insertTownSchema).optional().parse(req.body.townsTab);
    }
    next();
  },
  asyncHandler(async (req, res) => {
    const { countryCode, city, operation, townsTab } = req.body;

    try {
      if (operation === 'create') {
        const cityInstance = await db
          .insert(cities)
          .values({ ...city, countryCode })
          .returning()
          .then((rows) => rows[0]);

        // Add associated towns if provided
        if (townsTab && townsTab.length > 0) {
          for (const town of townsTab) {
            await db
              .insert(towns)
              .values({
                ...town,
                cityCode: cityInstance.code,
              })
              .returning();
          }
        }

        res
          .status(StatusCodes.CREATED)
          .json({ message: 'City added', city: cityInstance });
      } else if (operation === 'delete') {
        // delete the city
        await db
          .delete(cities)
          .where(
            and(eq(cities.code, city.code), eq(cities.countryCode, countryCode)),
          );

        res
          .status(StatusCodes.OK)
          .json({ message: 'City and associated towns deleted' });
      }
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Operation failed', error: error.message });
    }
  }),
);
export default cityRouter;
