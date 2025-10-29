import { z } from 'zod';
export const categoryskillSchema = z.object({
    title: z.string().min(3, 'Title min 3 characters').max(100, 'Title max 100 characters'),
});

export const skillSchema = z.object({
    title: z.string().min(3, 'Title min 3 characters').max(100, 'Title max 100 characters'),
    category_id: z.string().min(3, 'Category min 3 characters').max(255, 'Category max 255 characters'),
});

export const skill_iconSchema = z.object({
    skill_id: z.string().min(1),
    icon_id: z.string().min(1),
});