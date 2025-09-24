import { hash, verify } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import crypto from 'crypto';
import { createUser } from '../repositories/userRepository';

export async function login(event: RequestEvent, username: unknown, password: unknown) {
    if (!validateUsername(username) || !validatePassword(password)) {
        return fail(400, { message: 'Invalid username or password format' });
    }

    const results = await db.select().from(table.users).where(eq(table.users.username, username));
    const existingUser = results.at(0);

    if (!existingUser) return fail(400, { message: 'Incorrect username or password' });

    const validPassword = await verify(existingUser.passwordHash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) return fail(400, { message: 'Incorrect username or password' });

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/dashboard');
}

export async function register(event: RequestEvent, username: string, password: string, role: string, email: string) {

    const userId = generateUserId();
    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    try {
        await createUser({
            id: userId,
            username,
            email,
            passwordHash,
            role,
            createdAt: new Date(),
            updatedAt: new Date()
        });

    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
    return redirect(302, '/dashboard/access-login/account');
}

function generateUserId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const bytes = crypto.randomBytes(15);
    const id = encodeBase32LowerCase(bytes);
    return id;
}

function validateUsername(username: unknown): username is string {
    return (
        typeof username === 'string' &&
        username.length >= 3 &&
        username.length <= 31 &&
        /^[a-z0-9_-]+$/.test(username)
    );
}

function validatePassword(password: unknown): password is string {
    return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
