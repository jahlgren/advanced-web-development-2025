import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Project, project } from "@/models/project";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth";

export type GetProjectByIdResponse = Project;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id } = await params;

    try {
      const result = await db
        .select()
        .from(project)
        .where(and(eq(project.id, id), eq(project.userId, session.user.id)))
        .execute()
        .then(res => res[0]);

      if (!result) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json<GetProjectByIdResponse>(result);
    } catch (err) {
      console.error("Error fetching project: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
