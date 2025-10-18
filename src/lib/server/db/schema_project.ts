import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { icons } from './schema_icons';
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
    url: text('url').notNull(), // URL Cloudinary
    description: text('description').notNull(),
    publicId: text('publicId').notNull(), // ex: Cloudinary public ID
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
 * Junction table Many-to-Many: Project ↔ ProjectIcon
 */
export const project_icons = pgTable('project_icons', {
    project_id: text('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),

    icon_id: text('icon_id')
        .notNull()
        .references(() => icons.id, { onDelete: 'cascade' })
});

/**
 * Types
 */
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type CategoryProject = typeof category_project.$inferSelect;
export type NewCategoryProject = typeof category_project.$inferInsert;


export type ProjectIcons = typeof project_icons.$inferSelect;
export type NewProjectIcons = typeof project_icons.$inferInsert;
