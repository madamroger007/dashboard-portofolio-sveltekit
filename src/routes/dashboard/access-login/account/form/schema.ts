import { z } from 'zod';

export const accountSchema = z.object({
  username: z.string().min(3, "Minimal 3 character").max(31, "Maksimal 31 character"),
  email: z.email("Format email not valid"),
  password: z.string().min(6, "Password minimal 6 character"),
  confirmPassword: z.string().min(6),
  role: z.enum(['Admin', 'Management', 'Staff'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password not match",
  path: ["confirmPassword"]
});

export type AccountForm = z.infer<typeof accountSchema>;