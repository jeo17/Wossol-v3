import { pgTable, serial, uuid, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define enum for format codes
export const formatCodeEnum = pgEnum("format_code", ["A3", "A4", "A5"]);

export const formats = pgTable("formats", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  code: formatCodeEnum("code").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertFormatSchema = createInsertSchema(formats, {
  code: z.enum(formatCodeEnum.enumValues),
  active: z.boolean().optional(),
}).omit({ id: true, uuid: true });

export const formatSchema = formats.$inferInsert;


