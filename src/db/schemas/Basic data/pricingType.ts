import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { TypesSchema, createTypesColumns } from '../../func/createTypes';

export const pricingTypes = pgTable('pricingTypes', {
  ...createTypesColumns(),
});

export const insertPricingTypeSchema = createInsertSchema(pricingTypes, {
  ...TypesSchema,
}).omit({
  id: true,
  uuid: true,
  active: true,
});

export const pricingTypeSchema = pricingTypes.$inferInsert;
