import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { Category, category } from "@/models/category";
import { project } from "@/models/project";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;

    // Validate that project id is given.
    // However, this should never happen.
    if (!projectId) {
      console.log("Project id missing");
      return NextResponse.json({ error: "Project id missing." }, { status: 400 });
    }

    try {
      // Check that the project belongs the user.
      const projectRecord = await db
        .select().from(project)
        .where(and(eq(project.id, projectId), eq(project.userId, session.user.id)))
        .limit(1);

      if (projectRecord.length !== 1) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // Get categories
      const result = await db
        .select()
        .from(category)
        .where(eq(category.projectId, projectId));

      return NextResponse.json<Category[]>(result, { status: 200 });
    } catch (err) {
      console.error("Error fetching categories: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}