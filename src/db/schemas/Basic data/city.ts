import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { countries } from './country';

import { BdataSchema, createBdataColumns } from '../../func/createBdata';

export const cities = pgTable('cities', {
  ...createBdataColumns(),
  countryCode: varchar('country_code')
    .references(() => countries.code, {onDelete: "cascade", onUpdate: "cascade"})
    .notNull(),
});

export const insertCitySchema = createInsertSchema(cities, BdataSchema).omit({
  id: true,
  uuid: true,
  active: true,
  countryCode: true,
});

export const citySchema = cities.$inferInsert;
