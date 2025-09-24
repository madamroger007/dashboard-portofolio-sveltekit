import { db } from '$lib/server/db';
import { users, type User } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function createUser(data: User) {
  const [user] = await db.insert(users).values(data);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserAll(): Promise<User[]> {
  const user = await db.select().from(users);
  return user;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
  const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id));
}
