import { z } from 'zod';
export const IconSchema = z.object({
    name: z.string().min(3, 'Name min 3 character').max(100, 'Name max 100 character'),
    image: z.file().optional(),
    // fileName: z.string().min(3, 'File name min 3 character').max(200, 'File name max 200 character').optional(),
});
