import { NextResponse } from "next/server";
import db from "@/lib/db";
import { Project, project } from "@/models/project";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/auth";
import { UpdateProjectInfoSchema } from "@/form-schemas/update-project-info-schema";
import { verifyProjectOwnership } from "./utils";

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


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; timelogId: string }> }
) {
  return withAuth(async (session) => {

    // Validate params.
    const { id: projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project id missing." },
        { status: 400 }
      );
    }

    // Validate input data.
    const body = await req.json();
    const parsed = UpdateProjectInfoSchema.safeParse(body);
    if(!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 422 }
      );
    }
    const data = parsed.data;

    try {
      // Verify project ownership.
      const ownership = await verifyProjectOwnership(projectId, session.user.id);
      if(!ownership.ok) {
        return ownership.response;
      }

      // Update timelog.
      const updated = await db
        .update(project)
        .set({
          title: data.title,
          description: data.description ? data.description : null
        })
        .where(and(eq(project.id, projectId), eq(project.userId, session.user.id)))
        .returning();

      if (updated.length < 1) {
        return NextResponse.json(
          { error: "Project not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<Project>(updated[0], { status: 200 });
    } catch (err) {
      console.error("Error updating project info: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; timelogId: string }> }
) {
  return withAuth(async (session) => {

    // Validate params.
    const { id: projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project id missing." },
        { status: 400 }
      );
    }

    try {
      // Verify project ownership.
      const ownership = await verifyProjectOwnership(projectId, session.user.id);
      if(!ownership.ok) {
        return ownership.response;
      }

      // Delete project.
      const result = await db.delete(project).where(
        and(
          eq(project.id, projectId),
          eq(project.userId, session.user.id)
        )
      );

      if(!result.rowCount) {
        return NextResponse.json(
          { error: "Project not found." },
          { status: 404 }
        )
      }
      return NextResponse.json({ok: true, projectId}, { status: 200 });
    } catch (err) {
      console.error("Error deleting project: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}