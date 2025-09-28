import type { Certification } from "$lib/server/db/schema_certification";
import type { Experience, CategoryExperience } from "$lib/server/db/schema_experience";

export type UpdateCertification = Omit<Certification, 'id' | 'createdAt'>;
export type CreateCertification = Omit<Certification, 'id' | 'updatedAt'>;
export type UpdateExperience = Omit<Experience, 'id' | 'createdAt'>;
export type CreateExperience = Omit<Experience, 'id' | 'updatedAt'>;
export type CreateCategoryExperience = Omit<CategoryExperience, 'id' | 'updatedAt'>;
export type UpdateCategoryExperience = Omit<CategoryExperience, 'id' | 'createdAt'>;