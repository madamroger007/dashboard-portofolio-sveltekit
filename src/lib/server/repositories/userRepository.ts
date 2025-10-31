import { db } from '$lib/server/db/client';
import { users, type User, session, token_users, type TokenUser } from '$lib/server/db/schemaAuth';
import { eq } from 'drizzle-orm';

export async function createUserRepository(data: User) {
  await db.insert(users).values(data);
}

export async function getUserByIdRepository(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserAllRepository() {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      token: token_users.token,
      tokenId: token_users.id,
      tokenCreatedAt: token_users.createdAt
    })
    .from(users)
    .leftJoin(token_users, eq(users.id, token_users.userId));

  return result;
}

export async function getUserByUsernameRepository(username: string): Promise<User[]> {
  return await db.select().from(users).where(eq(users.username, username));

}

export async function updateUserRepository(id: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, id)).returning();

}

export async function deleteUserRepository(id: string): Promise<void> {
  await db.delete(session).where(eq(session.userId, id));
  await db.delete(token_users).where(eq(token_users.userId, id));
  await db.delete(users).where(eq(users.id, id));

}

export async function addTokenUsersRepository(data: TokenUser): Promise<void> {
  await db.insert(token_users).values(data);
}

export async function getTokenUsersByUserIdRepository(userId: string) {
  return db.query.token_users.findFirst({
    where: eq(token_users.userId, userId)
  });
}

export async function getTokenUsersByTokenRepository(token: string) {
  return db.query.token_users.findFirst({
    where: eq(token_users.token, token)
  });
}

export async function updateTokenUsersRepository(id: string, data: Partial<TokenUser>): Promise<void> {
  await db.update(token_users).set(data).where(eq(token_users.userId, id)).returning();
}
