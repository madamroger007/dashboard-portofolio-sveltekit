CREATE TABLE "category_experience" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"sub_title" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"name_institution" varchar(100) NOT NULL,
	"description" varchar(200) NOT NULL,
	"time_start" date,
	"time_end" date,
	"category_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "experience" ADD CONSTRAINT "experience_category_id_category_experience_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category_experience"("id") ON DELETE no action ON UPDATE no action;