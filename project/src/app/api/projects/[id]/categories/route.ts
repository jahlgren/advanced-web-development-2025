import { CreateCategoriesSchema } from "@/form-schemas/create-categories-schema";
import { withAuth } from "@/lib/auth";
import db from "@/lib/db";
import { Category, category } from "@/models/category";
import { project } from "@/models/project";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyProjectOwnership } from "../utils";
import { createId } from "@paralleldrive/cuid2";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  return withAuth(async (session) => {
    const { id: projectId } = await params;

    // Validate that project id is given.
    // However, this should never happen.
    if (!projectId) {
      console.log("Project id missing");
      return NextResponse.json({ error: "Project id missing." }, { status: 400 });
    }

    try {
      // Check that the project belongs the user.
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

      // Get categories
      const result = await db
        .select()
        .from(category)
        .where(eq(category.projectId, projectId))
        .orderBy(category.createdAt);

      return NextResponse.json<Category[]>(result, { status: 200 });
    } catch (err) {
      console.error("Error fetching categories: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

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
    const parsed = CreateCategoriesSchema.safeParse(body);
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

      // Get existing categories.
      const existingCategories = await db
        .select({ name: category.name })
        .from(category)
        .where(eq(category.projectId, projectId))
        .then(res => res.map(v => v.name))

      // Create insert data.
      const categoryInserts = data.categories
        .filter(name => existingCategories.indexOf(name) === -1)
        .map((name) => ({
          id: createId(),
          name,
          projectId,
          createdAt: new Date()
        }));

      // Validate that we actually have one category to insert.
      if(categoryInserts.length < 1) {
        return NextResponse.json(
          { error: 'Atleast one new category needs to be added.' },
          { status: 422 }
        );
      }

      // Insert categories.
      const insertedCategories = await db.insert(category).values(categoryInserts).returning();

      return NextResponse.json<Category[]>(insertedCategories, { status: 201 });
    } catch (err) {
      console.error("Error creating project: ", err instanceof Error ? err.message : err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
