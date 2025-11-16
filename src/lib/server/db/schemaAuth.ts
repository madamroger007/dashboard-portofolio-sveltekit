import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	username: varchar('username', { length: 100 }).notNull().unique(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: varchar('role', { length: 50 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.notNull()
		.defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('users_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const token_users = pgTable('token_users', {
	id: text('id').primaryKey(),
	token: text('token').notNull().unique(),
	accessToken: text('access_token').notNull().unique(),
	refreshToken: text('refresh_token').notNull().unique(),
	userId: text('users_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	refreshExpiresAt: timestamp('refresh_expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
		.notNull()
		.defaultNow()
})

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;

export type TokenUser = typeof token_users.$inferSelect