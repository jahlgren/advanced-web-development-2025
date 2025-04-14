CREATE TABLE "timelog" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"category_id" text NOT NULL,
	"description" text,
	"start" timestamp NOT NULL,
	"emd" timestamp,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "timelog" ADD CONSTRAINT "timelog_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timelog" ADD CONSTRAINT "timelog_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;