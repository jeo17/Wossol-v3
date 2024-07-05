import { pgTable, serial, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { towns } from "../Basic data/town";
import { createInsertSchema } from "drizzle-zod";
import { string, z } from "zod";

export const recievers = pgTable("recievers", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    phoneNumber: varchar("phone_number").notNull(),
    secondPhoneNumber: varchar("second_phone_number"),
    address: varchar("address").notNull(),
    townCode: varchar("town_code").references(() => towns.code, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }).notNull(),
    active: boolean("active").notNull().default(true),
  });


  export const insertRecieverSchema = createInsertSchema(recievers, {
    firstName: z.string().min(2, { message: "First name cannot be empty" }),
    lastName: z.string().min(2, { message: "Last name cannot be empty" }),
    phoneNumber: z.string().min(10).max(10),
    secondPhoneNumber: z.string().min(10).max(10).optional(),
    townCode: z.string().min(1, { message: "town code cannot be empty" }),
  }).omit({ id: true, uuid: true });
