import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { category } from "@/models/category";
import { timelog } from "@/models/timelog";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyProjectOwnership } from "../../utils";

export type TimelogCategoryStats = {
  categoryId: string,
  categoryName: string,
  totalSeconds: number
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;
    
    // Validate that project id is given.
    // However, this should never happen.
    if (!projectId) {
      return NextResponse.json({ error: "Project id missing." }, { status: 400 });
    }

    try {
      // Verify project ownership.
      const ownership = await verifyProjectOwnership(projectId, session.user.id);
      if(!ownership.ok) {
        return ownership.response;
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

      return NextResponse.json(parsedResult, { status: 200 });
    } catch (err) {
      console.error("Error fetchin project statistics: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
