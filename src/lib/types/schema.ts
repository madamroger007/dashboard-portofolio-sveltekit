import type { Certification } from "$lib/server/db/schema_certification";

export type UpdateCertification = Omit<Certification, 'id' | 'createdAt'>;
export type CreateCertification = Omit<Certification, 'id' | 'updatedAt'>;