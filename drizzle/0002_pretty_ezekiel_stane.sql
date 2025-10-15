CREATE TABLE "category_project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"sub_title" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"category_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_icon" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"url" text NOT NULL,
	"file_name" varchar(200)
);
--> statement-breakpoint
CREATE TABLE "project_project_icon" (
	"project_id" text NOT NULL,
	"icon_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_category_id_category_project_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category_project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_project_icon" ADD CONSTRAINT "project_project_icon_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_project_icon" ADD CONSTRAINT "project_project_icon_icon_id_project_icon_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."project_icon"("id") ON DELETE cascade ON UPDATE no action;