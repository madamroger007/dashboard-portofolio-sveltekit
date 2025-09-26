import { db } from '$lib/server/db';
import { users, type User, session } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function createUserRepository(data: User) {
  await db.insert(users).values(data);
}

export async function getUserByIdRepository(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserAllRepository(): Promise<User[]> {
  const user = await db.select().from(users);
  return user;
}

export async function getUserByUsernameRepository(username: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function updateUserRepository(id: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, id)).returning();

}

export async function deleteUserRepository(id: string): Promise<void> {
  // hapus semua session user ini
  await db.delete(session).where(eq(session.userId, id));

  // hapus user
  await db.delete(users).where(eq(users.id, id));
}
