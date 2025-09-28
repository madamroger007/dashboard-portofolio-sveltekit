import { z } from 'zod';

export const certifSchema = z.object({
    title: z.string().min(3, 'Title min 3 character').max(255, 'Title max 255 character'),
    link_cert: z.string()
        .min(3, 'Link min 3 character')
        .max(255, 'Link max 255 character')
        .url('Link harus berupa URL valid'),
    name_institution: z.string().min(3, 'name institusi min 3 character').max(255, 'Name institusi max 255 character'),
    time_cert: z.coerce.date(),
});
 