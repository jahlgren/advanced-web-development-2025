import { withAuth } from "@/lib/auth";
import { CreateProjectSchema } from "@/form-schemas/create-project-schemas";
import db from "@/lib/db";
import { project } from "@/models/project";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { category } from "@/models/category";
import cuid from 'cuid';
import { desc, eq } from "drizzle-orm";
import { Project } from "@/lib/types";

export type PostProjectResponse = Project;
export type PostProjectResponseError = { error: string };
export type GetProjectsResponse = Project[];
export type GetProjectsResponseError = { error: string };

export async function POST(req: Request) {
  return withAuth(async (session) => {
    try {
      const body = await req.json();
      const parsed = CreateProjectSchema.parse(body);
    
      const result = await db.insert(project).values({
        id: cuid(),
        userId: session.user.id,
        title: parsed.title,
        description: parsed.description,
        createdAt: new Date()
      }).returning();

      const categoryInserts = parsed.categories.map((name) => ({
        id: cuid(),
        name,
        projectId: result[0].id,
        createdAt: new Date()
      }));

      if(categoryInserts.length > 0)
        await db.insert(category).values(categoryInserts);
    
      return NextResponse.json<PostProjectResponse>(result[0], { status: 201 });

    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json<PostProjectResponseError>(
          { error: error.errors[0].message },
          { status: 422 }
        );
      }

      console.log(error);
      return NextResponse.json(
        { error: "Failed to create project, server error." },
        { status: 500 }
      );
    }
  });
}

export async function GET() {
  return withAuth(async (session) => {
    try {
      const projects = await db
        .select()
        .from(project)
        .where(eq(project.userId, session.user.id))
        .orderBy(desc(project.createdAt));

      return NextResponse.json<GetProjectsResponse>(projects);
    } catch (err) {
      console.error(err);
      return NextResponse.json<GetProjectsResponseError>({ error: "Failed to fetch projects" }, { status: 500 });
    }
  });
}
