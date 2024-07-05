import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { groups } from './groups';
import { groupsRoles } from './groupsRoles';
import { users } from './users';

export const groupsUsers = pgTable(
  'groups_users',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.uuid, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    groupName: varchar('group_name')
      .notNull()
      .references(() => groups.name, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.groupName, t.userId] }) }),
);

export const groupRelations = relations(groupsUsers, ({ one, many }) => {
  return {
    user: one(users, {
      fields: [groupsUsers.userId],
      references: [users.id],
    }),
    group: many(groupsRoles),
  };
});

export const insertGroupsUsersSchema = createInsertSchema(groupsUsers, {
  groupName: z.string().min(1, { message: 'Group name cannot be empty' }),
  userId: z
    .string()
    .uuid()
    .min(1, { message: 'User ID cannot be empty' })
    .array(), // Changed to single UUID
});
