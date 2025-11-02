import { db } from '$lib/server/db/client';
import { users, type User, session, token_users, type TokenUser } from '$lib/server/db/schemaAuth';
import { eq } from 'drizzle-orm';
import { getCache, setCache, delCache } from '$lib/server/repositories/redisRepository';

async function invalidateUserCache(userId?: string, username?: string) {
  const jobs: Promise<void>[] = [];

  // Cache per-user dan token
  if (userId) {
    jobs.push(delCache(`user:${userId}`));
    jobs.push(delCache(`token:user:${userId}`));
  }

  // Cache per-username
  if (username) {
    jobs.push(delCache(`user:username:${username}`));
  }

  // Cache list global user
  jobs.push(delCache('user:all'));

  await Promise.all(jobs);
}

/* =====================================================
 * ================ USER CRUD OPERATIONS ================
 * ===================================================== */

/** CREATE */
export async function createUserRepository(data: User) {
  await db.insert(users).values(data);
  await invalidateUserCache(); // hanya refresh list global
}

/** READ ALL USERS */
export async function getUserAllRepository() {
  const cacheKey = 'user:all';
  const cached = await getCache<any[]>(cacheKey);
  if (cached) return cached;

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
      tokenCreatedAt: token_users.createdAt,
    })
    .from(users)
    .leftJoin(token_users, eq(users.id, token_users.userId));

  await setCache(cacheKey, result);
  return result;
}

/** READ USER BY ID */
export async function getUserByIdRepository(id: string): Promise<User | undefined> {
  const cacheKey = `user:${id}`;
  const cached = await getCache<User>(cacheKey);
  if (cached) return cached;

  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (user) await setCache(cacheKey, user);

  return user;
}

/** READ USER BY USERNAME */
export async function getUserByUsernameRepository(username: string): Promise<User[]> {
  const cacheKey = `user:username:${username}`;
  const cached = await getCache<User[]>(cacheKey);
  if (cached) return cached;

  const result = await db.select().from(users).where(eq(users.username, username));
  await setCache(cacheKey, result);

  return result;
}

/** UPDATE USER */
export async function updateUserRepository(id: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, id));
  await invalidateUserCache(id, data.username);
}

/** DELETE USER */
export async function deleteUserRepository(id: string): Promise<void> {
  await db.delete(session).where(eq(session.userId, id));
  await db.delete(token_users).where(eq(token_users.userId, id));
  await db.delete(users).where(eq(users.id, id));

  await invalidateUserCache(id);
}

/* =====================================================
 * =============== TOKEN MANAGEMENT ====================
 * ===================================================== */

/** ADD TOKEN USER */
export async function addTokenUsersRepository(data: TokenUser): Promise<void> {
  await db.insert(token_users).values(data);
  await invalidateUserCache(data.userId);
}

/** GET TOKEN BY USER ID */
export async function getTokenUsersByUserIdRepository(userId: string) {
  const cacheKey = `token:user:${userId}`;
  const cached = await getCache<any>(cacheKey);
  if (cached) return cached;

  const result = await db.query.token_users.findFirst({
    where: eq(token_users.userId, userId),
  });

  if (result) await setCache(cacheKey, result);
  return result;
}

/** GET TOKEN BY TOKEN VALUE */
export async function getTokenUsersByTokenRepository(token: string) {
  const cacheKey = `token:${token}`;
  const cached = await getCache<any>(cacheKey);
  if (cached) return cached;

  const result = await db.query.token_users.findFirst({
    where: eq(token_users.token, token),
  });

  if (result) await setCache(cacheKey, result);
  return result;
}

/** UPDATE TOKEN */
export async function updateTokenUsersRepository(id: string, data: Partial<TokenUser>): Promise<void> {
  await db.update(token_users).set(data).where(eq(token_users.userId, id));
  await invalidateUserCache(id);
}
