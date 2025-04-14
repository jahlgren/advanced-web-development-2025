import { NextResponse } from 'next/server';
import cuid from 'cuid';
import db from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { CreateTimeLogSchema } from '@/form-schemas/create-time-log-schema';
import { timelog } from '@/models/timelog';
import { project } from '@/models/project';
import { and, desc, eq } from 'drizzle-orm';
import { Timelog } from '@/lib/types';
import { category } from '@/models/category';

export type GetTimelogResponse = Timelog[];
export type GetTimelogResponseError = { error: string };

export type PostTimelogResponse = Timelog;
export type PostTimelogResponseError = { error: string };

const generalError = 'You are not authorized to perform this action';
const generalErrorStatus = 403;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;

    if (!projectId) {
      console.log("Project id missing");
      return NextResponse.json<GetTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
    }

    try {
      const projectRecord = await db.select().from(project).where(eq(project.id, projectId)).limit(1).execute();

      if (projectRecord.length === 0 || projectRecord[0].userId !== session.user.id) {
        return NextResponse.json<GetTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
      }
      
      const timelogs = await db.select().from(timelog).where(eq(timelog.projectId, projectId)).orderBy(desc(timelog.start)).execute();
      return NextResponse.json<GetTimelogResponse>(timelogs, { status: 200 });
    } catch (error) {
      console.error("Error fetching timelogs:", error);
      return NextResponse.json<GetTimelogResponseError>({ error: 'Failed to get timelogs' }, { status: 500 });
    }
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;
    try {
      const body = await req.json();
      const parsed = CreateTimeLogSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json<PostTimelogResponseError>({ error: parsed.error.errors[0].message }, { status: 400 });
      }

      const data = parsed.data;
      
      const projectRecord = await db.select().from(project).where(eq(project.id, projectId)).limit(1).execute();

      if (!projectRecord.length) {
        return NextResponse.json<PostTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
      }

      if (projectRecord[0].userId !== session.user.id) {
        return NextResponse.json<PostTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
      }

      const categoryRecord = await db.select().from(category)
        .where(and(eq(category.id, data.categoryId), eq(category.projectId, projectId)))
        .limit(1).execute();
    
      if (!categoryRecord.length) {
        return NextResponse.json<PostTimelogResponseError>({ error: generalError }, { status: generalErrorStatus });
      }

      const result = await db.insert(timelog).values({
        id: cuid(),
        projectId,
        categoryId: data.categoryId,
        description: data.description,
        start: new Date(data.start),
        end: data.end ? new Date(data.end) : null,
        createdAt: new Date()
      }).returning();
  
      return NextResponse.json<PostTimelogResponse>(result[0], { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json<PostTimelogResponseError>({ error: 'Failed to create timelog' }, { status: 500 });
    }
  });
}