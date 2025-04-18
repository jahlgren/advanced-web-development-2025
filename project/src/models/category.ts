import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { project } from "./project";
import { InferSelectModel } from "drizzle-orm";
			
export const category = pgTable("category", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => project.id, {
    onDelete: 'cascade'
  }),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull()
});

export type Category = InferSelectModel<typeof category>;
