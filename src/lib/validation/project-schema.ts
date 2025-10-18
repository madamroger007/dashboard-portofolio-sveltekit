import { z } from 'zod';
export const categoryprojectSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(100, 'Title max 100 character'),
    sub_title: z.string().min(3, 'Sub title min 3 character').max(100, 'Sub title max 100 character'),
});

export const projectSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(100, 'Title max 100 character'),
    image: z.file().optional(), // URL Cloudinary
    description: z.string().min(3, 'Description min 3 character').max(255, 'Description max 255 character'),
    category_id: z.string().min(3, 'Category min 3 character').max(255, 'Category max 255 character'),
});


export const project_project_iconSchema = z.object({
    project_id: z.string().min(1),
    icon_id: z.string().min(1),
});