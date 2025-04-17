import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { Timelog, timelog } from '@/models/timelog';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { category } from '@/models/category';
import { project } from '@/models/project';
import { createId } from '@paralleldrive/cuid2';
import { CreateTimelogSchema } from '@/form-schemas/create-timelog.schema';


const PAGE_SIZE = 10;


/**
 * Gets timelog history.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  console.log("GEETE TIMELOGSSS")
  return withAuth(async (session) => {
    const { id: projectId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");

    // Check that page numer is correctly given.
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
    }

    const offset = (page - 1) * PAGE_SIZE;

    try {
      // Validate that the project belongs to the user.
      const projectRecord = await db
        .select()
        .from(project)
        .where(
          and(eq(project.id, projectId), eq(project.userId, session.user.id))
        )
        .limit(1)
        .then((res) => res[0]);
      
      if(!projectRecord || projectRecord.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // Get the timelogs.
      const logs = await db
        .select({
          id: timelog.id,
          projectId: timelog.projectId,
          description: timelog.description,
          start: timelog.start,
          end: timelog.end,
          categoryId: timelog.categoryId,
          categoryName: category.name
        })
        .from(timelog)
        .leftJoin(category, eq(timelog.categoryId, category.id))
        .where(
          and(
            eq(timelog.projectId, projectId),
            isNotNull(timelog.end)
          )
        )
        .orderBy(desc(timelog.start))
        .limit(PAGE_SIZE + 1)
        .offset(offset);

        
      const hasNextPage = logs.length > PAGE_SIZE;
      const trimmedLogs = hasNextPage ? logs.slice(0, PAGE_SIZE) : logs;
      
      return NextResponse.json({
        data: trimmedLogs,
        nextPage: hasNextPage ? page + 1 : null,
      });
    } catch (err) {
      console.error("Error fetching timelogs: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}


/**
 * Starts a new active timelog.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;
    
    // Validate that project id is given.
    // However, this should never happen.
    if (!projectId) {
      console.log("Project id missing");
      return NextResponse.json({ error: "Project id missing." }, { status: 400 });
    }

    // Validate input data.
    const body = await req.json();
    const parsed = CreateTimelogSchema.safeParse(body);
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

      // Check for active timelog (no end time)
      const active = await db
        .select()
        .from(timelog)
        .where(
          and(
            eq(timelog.projectId, projectId),
            isNull(timelog.end)
          )
        )
        .limit(1);

      if (active.length > 0) {
        return NextResponse.json(
          { error: "An active timelog already exists." },
          { status: 404 }
        );
      }
      
      // Create new timelog
      const newLog = await db
        .insert(timelog)
        .values({
          id: createId(),
          projectId,
          categoryId: data.categoryId,
          description: data.description,
          start: data.start ? new Date(data.start) : new Date(),
          end: data.end ? new Date(data.end) : null,
          createdAt: new Date()
        })
        .returning()
        .then(res => res[0]);

      return NextResponse.json<Timelog>(newLog, { status: 201 });
    } catch (err) {
      console.error("Error creating project: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
