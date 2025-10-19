import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { icons } from './schema_icons';

export const category_skill = pgTable('category_skill', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
});

export const skills = pgTable('skill', {
    id: text('id').primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    category_id: text('category_id')
        .notNull()
        .references(() => category_skill.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
});

export const skill_icons = pgTable('skill_icons', {
    skill_id: text('skill_id')
        .notNull()
        .references(() => skills.id, { onDelete: 'cascade' }),

    icon_id: text('icon_id')
        .notNull()
        .references(() => icons.id, { onDelete: 'cascade' })
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;

export type CategorySkill = typeof category_skill.$inferSelect;
export type NewCategorySkill = typeof category_skill.$inferInsert;


export type SkillIcons = typeof skill_icons.$inferSelect;
export type NewSkillIcons = typeof skill_icons.$inferInsert;
