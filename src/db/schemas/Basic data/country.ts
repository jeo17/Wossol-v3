import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { BdataSchema, createBdataColumns } from '../../func/createBdata';
import { currencies } from './currency';

export const countries = pgTable('countries', {
  ...createBdataColumns(),
  currencyCode: varchar('currency_code')
    .references(() => currencies.code, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const insertCountrySchema = createInsertSchema(
  countries,
  BdataSchema,
).omit({ id: true, uuid: true, active: true, currencyCode: true });

export const countrySchema = countries.$inferInsert;
