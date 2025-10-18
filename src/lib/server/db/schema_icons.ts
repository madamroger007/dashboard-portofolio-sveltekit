import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

export const icons = pgTable('icons', {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    publicId: text('publicId').notNull(), // ex: Cloudinary public ID
    url: text('url').notNull(), // ex: Cloudinary URL
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
        .notNull()
        .defaultNow()
});

export type Icon = typeof icons.$inferSelect;
export type NewIcon = typeof icons.$inferInsert;