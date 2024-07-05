import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  pgEnum,
  pgTable,
  serial,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { towns } from "../Basic data/town";
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { groupsUsers } from './groupsUsers';

export const userTypeEnum = pgEnum('user_type', [
  'super_admin',
  'admin',
  'seller',
]);

export const genderEnum = pgEnum('gender', ['Male', 'Female']);

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull().unique(),
  uuid: uuid('uuid').defaultRandom().notNull().unique(),
  userType: userTypeEnum('user_type').notNull(),
  userName: varchar('user_name'),
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  phoneNumber: varchar('phone_number').notNull(),
  address: varchar('address').notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  gender: genderEnum('gender').notNull(),
  active: boolean('active').notNull().default(true),
  townCode: varchar("town_code").references(() => towns.code, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  groups: many(groupsUsers),
}));

// Refining the fields - useful if you want to change the fields before they become nullable/optional in the final schema
export const insertUserSchema = createInsertSchema(users, {
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: 'Password must contain at least one symbol',
    }),
  phoneNumber: z.string().min(10).max(10),
  userType: z.enum(userTypeEnum.enumValues),
  gender: z.enum(genderEnum.enumValues),
  dateOfBirth: z.string().date(),
  townCode: z.string().min(1, { message: "town code cannot be empty" }),
}).omit({ id: true, uuid: true, active: true });
