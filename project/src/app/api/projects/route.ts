import { withAuth } from "@/lib/auth";
import { CreateProjectSchema } from "@/form-schemas/create-project-schemas";
import db from "@/lib/db";
import { Project, project } from "@/models/project";
import { NextResponse } from "next/server";
import { category } from "@/models/category";
import { desc, eq } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';


/** 
 * Retrieves all projects belonging to the authenticated user. 
 */
export async function GET() {
  // withAuth checks that the user is signed in.
  // If the user is not signed in, a 401 response is returned.
  return withAuth(async (session) => {
    try {
      const projects = await db
        .select()
        .from(project)
        .where(eq(project.userId, session.user.id))
        .orderBy(desc(project.createdAt));

      return NextResponse.json<Project[]>(projects);
    } catch (err) {
      console.error("Error fetching projects: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

/** 
 * Creates a new project associated with the authenticated user. 
 */
export async function POST(req: Request) {
  return withAuth(async (session) => {
    try {
      // Validate input.
      const body = await req.json();
      const parsed = CreateProjectSchema.safeParse(body);
      if(!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message ?? "Invalid input" },
          { status: 422 }
        );
      }
      const data = parsed.data;
      
      const result = await db.transaction(async (trx) => {
        const inserted = await trx.insert(project).values({
          id: createId(),
          userId: session.user.id,
          title: data.title,
          description: data.description,
          createdAt: new Date()
        }).returning();
  
        const categoryInserts = data.categories.map((name) => ({
          id: createId(),
          name,
          projectId: inserted[0].id,
          createdAt: new Date()
        }));
  
        if(categoryInserts.length > 0)
          await trx.insert(category).values(categoryInserts);

        return inserted[0];
      });

      return NextResponse.json<Project>(result, { status: 201 });
    } catch (err) {
      console.error("Error creating project: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
