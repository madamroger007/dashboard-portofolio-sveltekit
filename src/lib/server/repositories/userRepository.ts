import { db } from '$lib/server/db/client';
import { users, type User, session } from '$lib/server/db/schemaAuth';
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

export async function getUserByUsernameRepository(username: string): Promise<User[]> {
  return await db.select().from(users).where(eq(users.username, username));
 
}

export async function updateUserRepository(id: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, id)).returning();

}

export async function deleteUserRepository(id: string): Promise<void> {
  await db.delete(session).where(eq(session.userId, id));

  await db.delete(users).where(eq(users.id, id));
}
