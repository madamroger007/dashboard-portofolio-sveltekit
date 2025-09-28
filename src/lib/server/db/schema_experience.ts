import { pgTable, text, timestamp, varchar, date } from 'drizzle-orm/pg-core';

export const experience = pgTable('experience', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    name_institution: varchar('name_institution', { length: 100 }).notNull(),
    description: varchar('description', { length: 200 }).notNull(),
    time_start: date('time_start'),
    time_end: date('time_end'),
    category_id: text('category_id').notNull().references(() => category_experience.id),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
        .notNull()
        .defaultNow()
});

export const category_experience = pgTable('category_experience', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    sub_title: varchar('sub_title', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
        .notNull()
        .defaultNow()
})

export type Experience = typeof experience.$inferSelect;
export type CategoryExperience = typeof category_experience.$inferSelect;