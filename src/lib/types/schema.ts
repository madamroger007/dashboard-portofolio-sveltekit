import { z } from 'zod';

export const baseAccountSchema = z.object({
    username: z.string().min(3, 'Username minimal 3 karakter'),
    email: z.string().email('Format email tidak valid'),
    role: z.enum(['Admin', 'Management', 'Staff'])
});

export const createAccountSchema = baseAccountSchema.extend({
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password dan Konfirmasi Password harus sama',
    path: ['confirmPassword']
});

export const updateAccountSchema = baseAccountSchema.extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional()
}).refine(
    (data) =>
        // validasi hanya jika salah satu diisi
        (!data.password && !data.confirmPassword) ||
        data.password === data.confirmPassword,
    {
        message: 'Password dan Konfirmasi Password harus sama',
        path: ['confirmPassword']
    }
);
