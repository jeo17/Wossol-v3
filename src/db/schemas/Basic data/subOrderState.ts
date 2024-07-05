import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { createStatesColumns, StatesSchema } from '../../func/createStates';
import { orderStates } from './orderState';

export const subOrderStates = pgTable('subOrderStates', {
  ...createStatesColumns(),
  orderStateCode: varchar('order_code')
  .references(() => orderStates.code, {onDelete: "cascade", onUpdate: "cascade"})
  .notNull(),
});

export const insertSubOrderStateSchema = createInsertSchema(subOrderStates, {
  ...StatesSchema,
}).omit({
  id: true,
  uuid: true,
  active: true,
  orderStateCode: true, 
});

export const subOrderStateSchema = subOrderStates.$inferInsert;