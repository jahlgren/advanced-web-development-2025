import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { project } from "@/models/project";
import { category } from "@/models/category";
import { timelog } from "@/models/timelog";
import { Timelog } from "@/lib/types";
import { UpdateTimeLogSchema } from "@/form-schemas/update-timelog-schema";

const generalError = 'You are not authorized to perform this action';
const generalErrorStatus = 403;

export type PatchTimelogResponse = Timelog;
export type PatchTimelogResponseError = { error: string };

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; timelogId: string }> }
) {
  return withAuth(async (session) => {
    const { id: projectId, timelogId } = await params;
    const body = await req.json();

    try {
      const projectRecord = await db
        .select().from(project)
        .where(and(eq(project.id, projectId), eq(project.userId, session.user.id)))
        .limit(1).then((res) => res[0]);

      if (!projectRecord) {
        return NextResponse.json<PatchTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
      }

      const parsed = UpdateTimeLogSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json<PatchTimelogResponseError>({ error: parsed.error.errors[0].message }, { status: 400 });
      }
      const data = parsed.data;

      if(data.categoryId) {
        const categoryValid = await db
          .select().from(category)
          .where(and(eq(category.id, data.categoryId), eq(category.projectId, projectId)))
          .limit(1)
          .then((res) => res.length > 0);

        if (!categoryValid) {
          return NextResponse.json<PatchTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
        }
      }

      const updated = await db
        .update(timelog)
        .set({
          description: typeof data.description === 'undefined' ? undefined : data.description,
          start: typeof data.start === 'undefined' ? undefined : new Date(data.start),
          end: typeof data.end === 'undefined' ? undefined : data.end ? new Date(data.end) : null,
          categoryId: typeof data.categoryId === 'undefined' ? undefined : data.categoryId,
        })
        .where(and(eq(timelog.id, timelogId), eq(timelog.projectId, projectId)))
        .returning();

      if (!updated.length) {
        return NextResponse.json<PatchTimelogResponseError>(
          { error: "Time log not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<PatchTimelogResponse>(updated[0], { status: 200 });
    } catch (err) {
      console.error(err);
      return NextResponse.json<PatchTimelogResponseError>({ error: 'Failed to update timelog' }, { status: 500 });
    }
  });
}