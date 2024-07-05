import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { BdataSchema, createBdataColumns } from '../../func/createBdata';

export const currencies = pgTable('currencies', {
  ...createBdataColumns(),
  symbol: varchar('symbol').notNull(),
});

export const insertCurrencieSchema = createInsertSchema(currencies, {
  ...BdataSchema,
  symbol: z.string().min(1, { message: 'Symbol cannot be empty' }),
}).omit({
  id: true,
  uuid: true,
  active: true,
});

export const currencieSchema = currencies.$inferInsert;
