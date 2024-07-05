import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { createStatesColumns, StatesSchema } from '../../func/createStates';

export const orderStates = pgTable('orderStates', {
  ...createStatesColumns(),
});

export const insertOrderStateSchema = createInsertSchema(orderStates, {
  ...StatesSchema,
}).omit({
  id: true,
  uuid: true,
  active: true,
});

export const orderStateSchema = orderStates.$inferInsert;
