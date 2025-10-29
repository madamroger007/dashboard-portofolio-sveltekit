import { z } from 'zod';
export const IconSchema = z.object({
    name: z.string().min(3, 'Name min 3 characters').max(100, 'Name max 100 characters'),
    image: z.file().optional(),
 
});
