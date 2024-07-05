import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  serial,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { groupsRoles } from './groupsRoles';

export const roles = pgTable(
  'roles',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    name: varchar('name').notNull().unique(),
    code: varchar('code').notNull().unique(),
    active: boolean('active').notNull().default(true),
  },
  (t) => ({
    index: index('roles_idx').on(t.name),
  }),
);

export const rolesRelations = relations(roles, ({ many }) => ({
  group: many(groupsRoles),
}));

export const insertRoleSchema = createInsertSchema(roles, {
  name: z.string().min(1, { message: 'Group name cannot be empty' }),
  code: z.string().min(1, { message: 'Group code cannot be empty' }),
}).omit({ id: true, uuid: true, active: true });

export const groupSchema = roles.$inferInsert;
