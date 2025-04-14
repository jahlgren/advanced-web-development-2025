import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { project } from "./project";
			
export const category = pgTable("category", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => project.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull()
});
