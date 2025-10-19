import { z } from 'zod';
export const categoryskillSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(100, 'Title max 100 character'),
});

export const skillSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(100, 'Title max 100 character'),
    category_id: z.string().min(3, 'Category min 3 character').max(255, 'Category max 255 character'),
});

export const skill_iconSchema = z.object({
    skill_id: z.string().min(1),
    icon_id: z.string().min(1),
});