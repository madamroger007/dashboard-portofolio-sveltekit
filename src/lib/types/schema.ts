import type { Certification } from "$lib/server/db/schema_certification";
import type { Experience, CategoryExperience } from "$lib/server/db/schema_experience";
import type { Project, CategoryProject, ProjectIcon } from "$lib/server/db/schema_project";

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
export type CreateProjectIcon = Omit<ProjectIcon, 'id' | 'updatedAt'>;
export type UpdateProjectIcon = Omit<ProjectIcon, 'id' | 'createdAt'>;
