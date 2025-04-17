import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { project } from "@/models/project";
import { category } from "@/models/category";
import { Timelog, timelog } from "@/models/timelog";
import { UpdateTimeLogSchema } from "@/form-schemas/update-timelog-schema";

type GetParamsReturnType = {
  valid: false,
  projectId: string,
  timelogId: string,
  response: NextResponse
} | {
  valid: true,
  projectId: string,
  timelogId: string
}

async function getParams(
  params: Promise<{ id: string; timelogId: string }>
): Promise<GetParamsReturnType> {
  const { id: projectId, timelogId } = await params;

  if (!projectId) {
    return {
      valid: false,
      projectId: '', timelogId: '',
      response: NextResponse.json(
        { error: "Project id missing." },
        { status: 400 }
      )
    };
  }

  if (!timelogId) {
    return {
      valid: false,
      projectId: '', timelogId: '',
      response: NextResponse.json(
        { error: "Timelog id missing." },
        { status: 400 }
      )
    };
  }

  return { valid: true, projectId, timelogId };
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; timelogId: string }> }
) {
  return withAuth(async (session) => {
    
    // Validate params.
    const { projectId, timelogId, ...paramsCheck} = await getParams(params);
    if(!paramsCheck.valid)  {
      return paramsCheck.response!;
    }

    try {
      // Check that the project belongs to the user.
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

      const result = await db.delete(timelog).where(
        and(
          eq(timelog.id, timelogId),
          eq(timelog.projectId, projectId)
        )
      );

      if(!result.rowCount) {
        return NextResponse.json(
          { error: "Timelog not found." },
          { status: 400 }
        )
      }

      return NextResponse.json({ok: true, timelogId}, { status: 200 });
    }
    catch (err) {
      console.error("Error deleting timelog: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; timelogId: string }> }
) {
  return withAuth(async (session) => {

    // Validate params.
    const { projectId, timelogId, ...paramsCheck} = await getParams(params);
    if(!paramsCheck.valid)  {
      return paramsCheck.response!;
    }

    // Validate input data.
    const body = await req.json();
    const parsed = UpdateTimeLogSchema.safeParse(body);
    if(!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 422 }
      );
    }
    const data = parsed.data;

    try {
      // Check that the project belongs to the user.
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

      // Valiadte category.
      if(data.categoryId) {
        const categoryValid = await db
          .select().from(category)
          .where(and(eq(category.id, data.categoryId), eq(category.projectId, projectId)))
          .limit(1)
          .then((res) => res.length > 0);

        if (!categoryValid) {
          return NextResponse.json(
            { error: "Category not found" },
            { status: 400 }
          );
        }
      }

      // Update timelog.
      const updated = await db
        .update(timelog)
        .set({
          description: typeof data.description === 'undefined' ? undefined : data.description,
          start: typeof data.start === 'undefined' ? undefined : new Date(data.start),
          end: typeof data.end === 'undefined' ? undefined : new Date(data.end),
          categoryId: typeof data.categoryId === 'undefined' ? undefined : data.categoryId,
        })
        .where(and(eq(timelog.id, timelogId), eq(timelog.projectId, projectId)))
        .returning();

      if (updated.length < 1) {
        return NextResponse.json(
          { error: "Time log not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<Timelog>(updated[0], { status: 200 });
    } catch (err) {
      console.error("Error updating timelog: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
