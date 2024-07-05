import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { createStatesColumns, StatesSchema } from '../../func/createStates';

export const feesStates = pgTable('feesStates', {
  ...createStatesColumns(),
});

export const insertFeesStateSchema = createInsertSchema(feesStates, {
  ...StatesSchema,
}).omit({
  id: true,
  uuid: true,
  active: true,
});

export const feesStateSchema = feesStates.$inferInsert;
