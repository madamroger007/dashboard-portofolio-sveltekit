import { pgTable, text, timestamp, varchar, date } from 'drizzle-orm/pg-core';

export const certification = pgTable('certification', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    link_cert: varchar('link_cert', { length: 100 }),
    name_institution: varchar('name_institution', { length: 100 }).notNull(),
    time_cert: date('time_cert'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
        .notNull()
        .defaultNow()
});

export type Certification = typeof certification.$inferSelect;
