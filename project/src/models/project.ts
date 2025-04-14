import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp('created_at').notNull()
});
