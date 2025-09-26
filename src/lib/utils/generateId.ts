import { encodeBase32LowerCase } from '@oslojs/encoding';
import crypto from 'crypto';
export default function generateId() {
    // ID with 120 bits of entropy, or about the same as UUID v4.
    const bytes = crypto.randomBytes(15);
    const id = encodeBase32LowerCase(bytes);
    return id;
}