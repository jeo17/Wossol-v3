import {serial, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";



export interface BdataType {
  id: number;
  uuid: string;
  code: string;
  nameEn: string;
  nameAr: string;
  nameFr: string;
  active: boolean;
}

export const createBdataColumns = () => ({
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  code: varchar("code").notNull().unique(),
  nameEn: varchar("name_en").notNull(),
  nameAr: varchar("name_ar"),
  nameFr: varchar("name_fr"),
  active: boolean("active").notNull().default(true),
});


export const BdataSchema = {
  code: z.string().min(1, { message: "Code cannot be empty" }),
  nameEn: z.string().min(1, { message: "English name cannot be empty" }),
  nameAr: z.string().min(1, { message: "Arabic name cannot be empty" }),
  nameFr: z.string().min(1, { message: "French name cannot be empty" }),
};

