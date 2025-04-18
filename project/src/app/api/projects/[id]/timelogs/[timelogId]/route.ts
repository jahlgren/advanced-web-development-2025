import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { category } from "@/models/category";
import { Timelog, timelog } from "@/models/timelog";
import { UpdateTimeLogSchema } from "@/form-schemas/update-timelog-schema";
import { verifyProjectOwnership } from "../../utils";

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


/** 
 * Updates the fields of a specific timelog entry for the given project.
 */
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
      // Verify project ownership.
      const ownership = await verifyProjectOwnership(projectId, session.user.id);
      if(!ownership.ok) {
        return ownership.response;
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


/** 
 * Deletes the specified timelog for the given project.
 */
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
      // Verify project ownership.
      const ownership = await verifyProjectOwnership(projectId, session.user.id);
      if(!ownership.ok) {
        return ownership.response;
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
