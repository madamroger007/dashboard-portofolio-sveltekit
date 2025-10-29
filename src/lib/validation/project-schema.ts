import { z } from 'zod';
export const categoryprojectSchema = z.object({
    title: z.string().min(3, 'Title min 3 characters').max(100, 'Title max 100 characters'),
    sub_title: z.string().min(3, 'Sub title min 3 characters').max(100, 'Sub title max 100 characters'),
});

export const projectSchema = z.object({
    title: z.string().min(3, 'Title min 3 characters').max(100, 'Title max 100 characters'),
    image: z.file().optional(),
    description: z.string().min(3, 'Description min 3 characters').max(255, 'Description max 255 characters'),
    category_id: z.string().min(3, 'Category min 3 characters').max(255, 'Category max 255 characters'),
});


export const project_project_iconSchema = z.object({
    project_id: z.string().min(1),
    icon_id: z.string().min(1),
});