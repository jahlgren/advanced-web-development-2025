ALTER TABLE "category" DROP CONSTRAINT "category_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "timelog" DROP CONSTRAINT "timelog_project_id_project_id_fk";
--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timelog" ADD CONSTRAINT "timelog_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;