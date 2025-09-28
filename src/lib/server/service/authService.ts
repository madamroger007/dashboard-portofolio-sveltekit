import { hash, verify } from '@node-rs/argon2';
import { fail, type RequestEvent } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import generateId from '$lib/utils/generateId';
import { createUserRepository, deleteUserRepository, updateUserRepository, getUserByUsernameRepository } from '../repositories/userRepository';
import { type User } from '$lib/server/db/schemaAuth';


export async function loginService(event: RequestEvent, username: unknown, password: unknown) {
    if (!validateUsername(username) || !validatePassword(password)) {
        return fail(400, { message: 'Invalid username or password format' });
    }

    const results = await getUserByUsernameRepository(username);
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
    return {
        success: true,
        status: 200,
        message: 'Login successful'
    }
}

export async function registerService(event: RequestEvent, username: string, password: string, role: string, email: string) {

    const userId = generateId();
    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    try {
        const userExists = await getUserByUsernameRepository(username);
        if (userExists.length > 0) {
            return fail(400, {
                error: true,
                errors: [{ field: 'username', message: 'Username already exists' }]
            });
        }

        console.log('Account created successfully');
        await createUserRepository({
            id: userId,
            username,
            email,
            passwordHash,
            role,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return {
            success: true,
            status: 200,
            message: 'Account created successfully'
        };

    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
}

export async function deleteAccountService(event: RequestEvent, id: string) {
    try {
        await deleteUserRepository(id);
    } catch {
        return fail(500, { message: 'An error has occurred' });
    }
    return {
        success: true,
        status: 200,
        message: 'Account deleted successfully'
    };
}

export async function updateAccountService(
    event: RequestEvent,
    data: { username: string; password?: string; role: string; email: string },
    id: string
) {
    try {
        const updateData: Partial<User> = {
            username: data.username,
            email: data.email,
            role: data.role,
            updatedAt: new Date()
        };

        // hanya update password jika user mengisi password baru
        if (data.password && data.password.trim() !== '') {
            updateData.passwordHash = await hash(data.password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1
            });
        }

        await updateUserRepository(id, updateData);
    } catch (err) {
        return fail(500, { message: 'An error has occurred' });
    }

    return {
        success: true,
        status: 200,
        message: 'Account updated successfully'
    };
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
