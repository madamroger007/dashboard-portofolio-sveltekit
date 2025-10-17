ALTER TABLE "project_icon" RENAME COLUMN "public_id" TO "publicId";--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "publicId" text NOT NULL;