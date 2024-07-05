import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { BdataSchema, createBdataColumns } from '../../func/createBdata';
import { cities } from './city';

export const towns = pgTable('towns', {
  ...createBdataColumns(),
  cityCode: varchar('city_code')
    .references(() => cities.code, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const insertTownSchema = createInsertSchema(towns, {
  ...BdataSchema,
  cityCode: z.string().min(1, { message: 'City code cannot be empty' }),
}).omit({
  id: true,
  uuid: true,
  active: true,
});
