import { z } from 'zod';

export const experienceSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(255, 'Title max 255 character'),
    name_institution: z.string().min(3, 'name institusi min 3 character').max(255, 'Name institusi max 255 character'),
    description: z.string().min(3, 'Description min 3 character').max(255, 'Description max 255 character'),
    time_start: z.coerce.date(),
    time_end: z.coerce.date(),
    category_id: z.string(),
});

export const categoryexperienceSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(255, 'Title max 255 character'),
    sub_title: z.string().min(3, 'Sub title min 3 character').max(255, 'Sub title max 255 character'),
});