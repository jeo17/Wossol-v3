import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';
import { groups } from './groups';
import { roles } from './roles';

export const groupsRoles = pgTable(
  'groups_roles',
  {
    groupName: varchar('group_name')
      .notNull()
      .references(() => groups.name, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    roleName: varchar('role_name')
      .notNull()
      .references(() => roles.name, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.groupName, t.roleName] }),
  }),
);

export const groupsRolesRelations = relations(groupsRoles, ({ one }) => ({
  group: one(groups),
  role: one(roles),
}));
