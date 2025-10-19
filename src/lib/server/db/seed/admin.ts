// src/lib/server/seed/admin.ts
import { db } from '$lib/server/db/client'; // sesuaikan path db instance
import { users } from '$lib/server/db/schemaAuth';
import { hash } from '@node-rs/argon2';
import generateId from '$lib/utils/generateId';

async function createAdmin() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'password';
    const role = process.env.ADMIN_ROLE || 'admin';

    // cek apakah sudah ada admin
    const existing = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.role, role)
    });

    if (existing) {
        console.log('⚠️  Existing admin found, skipping creation.');
        return;
    }

    const passwordHash = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    const userId = generateId();
    await db.insert(users).values({
        id: userId,
        username,
        email,
        passwordHash,
        role
    });

    console.log('✅ Default admin created successfully.');
}

createAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Failed to create default admin:', err);
        process.exit(1);
    });


