import db from "@/lib/db";
import { project } from "@/models/project";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

type OwnershipCheckResult = 
  | { ok: true }
  | { ok: false; response: Response };

export async function verifyProjectOwnership(
  projectId: string,
  userId: string
): Promise<OwnershipCheckResult> {
  const projectRecord = await db
    .select()
    .from(project)
    .where(and(eq(project.id, projectId), eq(project.userId, userId)))
    .limit(1);

  if (projectRecord.length !== 1) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    };
  }

  return { ok: true };
}
