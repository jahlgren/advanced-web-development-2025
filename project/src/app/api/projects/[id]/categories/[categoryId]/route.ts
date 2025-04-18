import { withAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import {UpdateCategorySchema} from '@/form-schemas/update-category-schema';
import { verifyProjectOwnership } from "../../utils";
import db from "@/lib/db";
import { Category, category } from "@/models/category";
import { and, eq } from "drizzle-orm";
import { timelog } from "@/models/timelog";

type GetParamsReturnType = {
  valid: false,
  projectId: string,
  categoryId: string,
  response: NextResponse
} | {
  valid: true,
  projectId: string,
  categoryId: string
}

async function getParams(
  params: Promise<{ id: string; categoryId: string }>
): Promise<GetParamsReturnType> {
  const { id: projectId, categoryId } = await params;

  if (!projectId) {
    return {
      valid: false,
      projectId: '', categoryId: '',
      response: NextResponse.json(
        { error: "Project id missing." },
        { status: 400 }
      )
    };
  }

  if (!categoryId) {
    return {
      valid: false,
      projectId: '', categoryId: '',
      response: NextResponse.json(
        { error: "Category id missing." },
        { status: 400 }
      )
    };
  }

  return { valid: true, projectId, categoryId };
}


/**
 * Updates an existing category for the specified project.
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  return withAuth(async (session) => {

    // Validate params.
    const { projectId, categoryId, ...paramsCheck} = await getParams(params);
    if(!paramsCheck.valid)  {
      return paramsCheck.response!;
    }

    // Validate input data.
    const body = await req.json();
    const parsed = UpdateCategorySchema.safeParse(body);
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
        .update(category)
        .set({
          name: data.name
        })
        .where(and(eq(category.id, categoryId), eq(category.projectId, projectId)))
        .returning();

      if (updated.length < 1) {
        return NextResponse.json(
          { error: "Category not found." },
          { status: 404 }
        );
      }

      return NextResponse.json<Category>(updated[0], { status: 200 });
    } catch (err) {
      console.error("Error updating category: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}


/** 
 * Deletes the specified category for the given project and 
 * reassigns all its timelogs to a replacement category. 
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; categoryId: string }> }
) {
  return withAuth(async (session) => {
    
    // Validate params.
    const { projectId, categoryId, ...paramsCheck} = await getParams(params);
    if(!paramsCheck.valid)  {
      return paramsCheck.response!;
    }

    try {
      // Verify project ownership.
      const ownership = await verifyProjectOwnership(projectId, session.user.id);
      if(!ownership.ok) {
        return ownership.response;
      }

      // Get replacement category id.
      const { searchParams } = new URL(req.url);
      const replacementId = searchParams.get("replacement");
      
      if(!replacementId) {
        return NextResponse.json(
          { error: "Replacement category id missing." },
          { status: 400 }
        )
      }

      // Validate that the replacement category belongs to this project.
      const replacementCategory = await db
        .select()
        .from(category)
        .where(
          and(
            eq(category.id, replacementId),
            eq(category.projectId, projectId)
          )
        );

      if(replacementCategory.length !== 1) {
        return NextResponse.json(
          { error: "Replacement category not found." },
          { status: 400 }
        )
      }

      const ok = await db.transaction(async (trx) => {
        // Replace category for timelogs
        await trx
          .update(timelog)
          .set({ categoryId: replacementId })
          .where(eq(timelog.categoryId, categoryId));

        // Delete category
        const result = await trx.delete(category).where(
          and(
            eq(category.id, categoryId),
            eq(category.projectId, projectId)
          )
        );

        if(!result.rowCount) {
          return false;
        }

        return true;
      });

      if(!ok) {
        return NextResponse.json(
          { error: "Category not found." },
          { status: 400 }
        )
      }

      return NextResponse.json({ok, categoryId}, { status: 200 });
    }
    catch (err) {
      console.error("Error deleting category: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
