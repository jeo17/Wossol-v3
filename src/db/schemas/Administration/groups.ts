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

import { groupsUsers } from './groupsUsers';
import { roles } from './roles';

export const groups = pgTable(
  'groups',
  {
    id: serial('id').primaryKey(),
    uuid: uuid('uuid').defaultRandom().notNull().unique(),
    name: varchar('name').notNull().unique(),
    code: varchar('code').notNull().unique(),
    active: boolean('active').notNull().default(true),
  },
  (t) => ({ index: index('group_idx').on(t.name) }),
);

export const groupsRelations = relations(groups, ({ many }) => ({
  user: many(groupsUsers),
  roles: many(roles),
}));

export const insertGroupSchema = createInsertSchema(groups, {
  name: z.string().min(1, { message: 'Group name cannot be empty' }),
  code: z.string().min(1, { message: 'Group code cannot be empty' }),
}).omit({ id: true, uuid: true, active: true });
