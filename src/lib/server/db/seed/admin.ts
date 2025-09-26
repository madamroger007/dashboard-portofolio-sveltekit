// src/lib/server/seed/admin.ts
import { db } from '$lib/server/db/client'; // sesuaikan path db instance
import { users } from '$lib/server/db/schemaAuth';
import { hash } from '@node-rs/argon2';
import generateId from '$lib/utils/generateId';
async function createAdmin() {
    const username = 'admin';
    const email = 'admin@gmail.com';
    const password = 'admin123'; // nanti bisa diganti dari dashboard
    const role = 'admin';

    // cek apakah sudah ada admin
    const existing = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.role, role)
    });

    if (existing) {
        console.log('⚠️  Admin sudah ada, skip seeding.');
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

    console.log('✅ Admin default berhasil dibuat.');
}

createAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Gagal membuat admin:', err);
        process.exit(1);
    });


