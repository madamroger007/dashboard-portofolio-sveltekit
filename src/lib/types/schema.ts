import type { Certification } from "$lib/server/db/schema_certification";
import type { Experience, CategoryExperience } from "$lib/server/db/schema_experience";
import type { Project, CategoryProject } from "$lib/server/db/schema_project";
import type { Icon } from "$lib/server/db/schema_icons";

export type UpdateCertification = Omit<Certification, 'id' | 'createdAt'>;
export type CreateCertification = Omit<Certification, 'id' | 'updatedAt'>;
export type UpdateExperience = Omit<Experience, 'id' | 'createdAt'>;
export type CreateExperience = Omit<Experience, 'id' | 'updatedAt'>;
export type CreateCategoryExperience = Omit<CategoryExperience, 'id' | 'updatedAt'>;
export type UpdateCategoryExperience = Omit<CategoryExperience, 'id' | 'createdAt'>;

/**
 * ✅ Tambahkan optional field iconIds untuk handle relasi Project ↔ Icons
 */
export type CreateProject = Omit<Project, 'id' | 'updatedAt'> & {
	iconIds?: string[];
};

export type UpdateProject = Omit<Project, 'id' | 'createdAt'> & {
	iconIds?: string[];
};

export type CreateCategoryProject = Omit<CategoryProject, 'id' | 'updatedAt'>;
export type UpdateCategoryProject = Omit<CategoryProject, 'id' | 'createdAt'>;
export type CreateIcon = Omit<Icon, 'id' | 'updatedAt'>;
export type UpdateIcon = Omit<Icon, 'id' | 'createdAt'>;
