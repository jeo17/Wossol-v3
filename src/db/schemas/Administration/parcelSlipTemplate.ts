import { boolean, pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { formats } from './format';
import { recievers } from './reciever';
import { users } from './users';

export const parcelSlipTemplates = pgTable('parcel_slip_templates', {
  id: serial('id').primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull(),
  code: varchar('code').notNull(),
  qrcode: varchar('qrcode').notNull(),
  barcode: varchar('barcode').notNull(),
  description: varchar('description').notNull(),
  template: varchar('template').notNull(),
  receiverId: uuid('receiver_id')
    .references(() => recievers.uuid, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull()
    .unique(),
  sellerId: uuid('seller_id')
    .references(() => users.uuid, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull()
    .unique(),
  formatId: uuid('format_id')
    .references(() => formats.uuid, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  active: boolean('active').notNull().default(true),
});

export const insertParcelSlipTemplateSchema = createInsertSchema(
  parcelSlipTemplates,
  {
    code: z.string().min(1, { message: 'Code cannot be empty' }),
    qrcode: z.string().min(1, { message: 'QR code cannot be empty' }),
    barcode: z.string().min(1, { message: 'Barcode cannot be empty' }),
    description: z.string().min(1, { message: 'Description cannot be empty' }),
    template: z.string().min(8, { message: 'Template cannot be empty' }),
    receiverId: z
      .string()
      .uuid({ message: 'Receiver ID must be a valid UUID' }),
    sellerId: z.string().uuid({ message: 'Seller ID must be a valid UUID' }),
    formatId: z.string().uuid({ message: 'Format ID must be a valid UUID' }),
  },
).omit({ id: true, uuid: true });

export const parcelSlipTemplateSchema = parcelSlipTemplates.$inferInsert;
