import { z } from 'zod';

export const certifSchema = z.object({
    title: z.string().min(3, 'Title min 3 characters').max(255, 'Title max 255 characters'),
    link_cert: z.string()
        .min(3, 'Link min 3 characters')
        .max(255, 'Link max 255 characters')
        .url('Link must be a valid URL'),
    name_institution: z.string().min(3, 'name institusi min 3 characters').max(255, 'Name institusi max 255 characters'),
    time_cert: z.coerce.date(),
});
