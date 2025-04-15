import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { category } from "@/models/category";
import { project } from "@/models/project";
import { timelog } from "@/models/timelog";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export type TimelogCategoryStats = {
  categoryId: string,
  categoryName: string,
  totalSeconds: number
}
export type GetTimelogStatsResponse = TimelogCategoryStats[];
export type GetTimelogStatsResponseError = { error: string };

const generalError = 'You are not authorized to perform this action';
const generalErrorStatus = 403;

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;

    if (!projectId) {
      console.log("Project id missing");
      return NextResponse.json<GetTimelogStatsResponseError>({ error: generalError }, { status: generalErrorStatus });
    }

    try {
      // Check that project belongs to the authenticated user
      const projectRecord = await db
        .select().from(project)
        .where(and(eq(project.id, projectId), eq(project.userId, session.user.id)))
        .limit(1);

      if (projectRecord.length !== 1) {
        return NextResponse.json<GetTimelogStatsResponseError>({ error: generalError }, { status: generalErrorStatus });
      }

      // Get total time spent in seconds per category
      const result = await db
        .select({
          categoryId: category.id,
          categoryName: category.name,
          totalSeconds: sql<number>`SUM(EXTRACT(EPOCH FROM COALESCE(${timelog.end}, now()) - ${timelog.start}))`.as("totalSeconds"),
        })
        .from(timelog)
        .innerJoin(category, eq(timelog.categoryId, category.id))
        .where(eq(timelog.projectId, projectId))
        .groupBy(category.id, category.name)
        .execute();

      // The totalSeconds is somehow returned as a string.
      // Therefore we still need to cast it to a number.
      const parsedResult = result.map(item => ({
        ...item,
        totalSeconds: Number(item.totalSeconds) || 0
      }));

      return NextResponse.json<GetTimelogStatsResponse>(parsedResult, { status: 200 });
    } catch (error) {
      console.error("Error fetching timelog stats:", error);
      return NextResponse.json<GetTimelogStatsResponseError>({ error: "Failed to fetch stats" }, { status: 500 });
    }
  });
}