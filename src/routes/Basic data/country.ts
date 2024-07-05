import { eq } from 'drizzle-orm';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { db } from '../../db';
import {
  countries,
  currencies,
  insertCountrySchema,
  insertCurrencieSchema,
} from '../../db/schemas';

const countryRouter = Router();

countryRouter.get(
  '/countries',
  asyncHandler(async (req, res) => {
    try {
      let allCountries = await db.select().from(countries);
      res.status(StatusCodes.OK).json(allCountries);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch countries' });
    }
  }),
);

countryRouter.post(
  '/countries/manage',
  (req, _, next) => {
    // Validate request body using Zod
    z.enum(['create', 'delete']).parse(req.body.operation),
      req.body.operation === 'create'
        ? insertCurrencieSchema.parse(req.body.currency)
        : null;

    insertCountrySchema.optional().parse(req.body.country);

    next();
  },
  asyncHandler(async (req, res) => {
    const { operation, country, currency } = req.body;

    try {
      if (operation === 'create') {
        let currencyInstance = await db
          .select()
          .from(currencies)
          .where(eq(currencies.code, currency.code))
          .then((rows) => rows[0]);

        if (!currencyInstance) {
          currencyInstance = await db
            .insert(currencies)
            .values(currency)
            .returning()
            .then((rows) => rows[0]);
        }

        let countryInstance;
        countryInstance = await db
          .insert(countries)
          .values({ ...country, currencyCode: currencyInstance.code })
          .returning()
          .then((rows) => rows[0]);
      } else if (operation === 'delete') {
        // Delete country and associated cities and towns
        const countryInstance = await db
          .select()
          .from(countries)
          .where(eq(countries.code, country.code))
          .then((rows) => rows[0]);

        if (countryInstance) {
          await db
            .delete(countries)
            .where(eq(countries.id, countryInstance.id));
        }
      }

      res.status(StatusCodes.OK).json({ message: 'Operation successful' });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Operation failed', error: error.message });
    }
  }),
);

export default countryRouter;
