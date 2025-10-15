import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Category Project
 */
export const category_project = pgTable('category_project', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    sub_title: varchar('sub_title', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
});

/**
 * Project
 */
export const projects = pgTable('project', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    image: text('image').notNull(), // URL Cloudinary
    description: text('description').notNull(),
    category_id: text('category_id')
        .notNull()
        .references(() => category_project.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
});

/**
 * Project Icon
 */
export const project_icon = pgTable('project_icon', {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    publicId: text('publicId').notNull(), // ex: Cloudinary public ID
    url: text('url').notNull(), // ex: Cloudinary URL
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
        .notNull()
        .defaultNow()
});

/**
 * Junction table Many-to-Many: Project ↔ ProjectIcon
 */
export const project_project_icon = pgTable('project_project_icon', {
    project_id: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),

    icon_id: text('icon_id')
        .notNull()
        .references(() => project_icon.id, { onDelete: 'cascade' })
});

/**
 * Types
 */
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type CategoryProject = typeof category_project.$inferSelect;
export type NewCategoryProject = typeof category_project.$inferInsert;

export type ProjectIcon = typeof project_icon.$inferSelect;
export type NewProjectIcon = typeof project_icon.$inferInsert;

export type ProjectProjectIcon = typeof project_project_icon.$inferSelect;
export type NewProjectProjectIcon = typeof project_project_icon.$inferInsert;
