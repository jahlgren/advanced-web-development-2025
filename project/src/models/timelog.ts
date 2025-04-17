import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { project } from "./project";
import { category } from "./category";
import { InferSelectModel } from "drizzle-orm";

export const timelog = pgTable("timelog", {
  id: text("id").primaryKey(),
  projectId: text('project_id').notNull().references(() => project.id),
  categoryId: text('category_id').notNull().references(() => category.id),
  description: text('description'),
  start: timestamp('start').notNull(),
  end: timestamp('emd'),
  createdAt: timestamp('created_at').notNull()
});

export type Timelog = InferSelectModel<typeof timelog>;
