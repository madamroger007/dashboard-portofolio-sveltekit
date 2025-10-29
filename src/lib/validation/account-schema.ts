import { z } from 'zod';

export const baseAccountSchema = z.object({
    username: z.string().min(3, 'Username minimal 3 characters'),
    email: z.string().email('Format email not valid'),
    role: z.enum(['Admin', 'Management', 'Staff'])
});

export const createAccountSchema = baseAccountSchema.extend({
    password: z.string().min(6, 'Password minimal 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password minimal 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password must match',
    path: ['confirmPassword']
});

export const updateAccountSchema = baseAccountSchema.extend({
    password: z.string().optional(),
    confirmPassword: z.string().optional()
}).refine(
    (data) =>
        (!data.password && !data.confirmPassword) ||
        data.password === data.confirmPassword,
    {
        message: 'Password and Confirm Password must match',
        path: ['confirmPassword']
    }
);
