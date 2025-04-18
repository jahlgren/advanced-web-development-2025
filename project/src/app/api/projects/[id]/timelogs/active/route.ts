import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { Timelog, timelog } from "@/models/timelog";
import { verifyProjectOwnership } from "../../utils";


/**
 * Retrieves the currently active (ongoing) timelog for the specified project. 
 */
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
        .limit(1)
        .then(res => res[0]);

      if(!active) {
        return NextResponse.json<null>(null, { status: 200 });
      }

      return NextResponse.json<Timelog>(active, { status: 200 });
    } catch (err) {
      console.error("Error creating project: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
