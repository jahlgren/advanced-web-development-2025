import { NextResponse } from "next/server";
import db from "@/lib/db";
import { project } from "@/models/project";
import { category } from "@/models/category";
import { eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth";
import { Category, Project } from "@/lib/types";

export type GetProjectByIdResponse = Project;
export type GetProjectByIdResponseError = { error: string };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id } = await params;

    try {
      const result = await db
        .select({
          project: project,
          categories: category
        })
        .from(project)
        .leftJoin(category, eq(project.id, category.projectId)) // LEFT JOIN to include all projects even without categories
        .where(eq(project.id, id))
        .execute();

      if (result.length === 0) {
        return NextResponse.json<GetProjectByIdResponseError>(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      if(result[0].project.userId !== session.user.id) {
        return NextResponse.json<GetProjectByIdResponseError>(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      const projectWithCategories = {
        ...result[0].project,
        categories: result.map((row) => row.categories).filter(Boolean) as Category[],
      };

      return NextResponse.json<GetProjectByIdResponse>(projectWithCategories);
    } catch (error) {
      console.error("Error fetching project with categories:", error);
      return NextResponse.json<GetProjectByIdResponseError>(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
