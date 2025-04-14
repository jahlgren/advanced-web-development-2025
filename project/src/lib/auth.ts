import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import db from "./db";
import { user } from "@/models/user";
import { account } from "@/models/account";
import { session } from "@/models/session";
import { NextResponse } from "next/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session
    }
  }), 
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  }
});

export async function withAuth(
  handler: (session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>) => Promise<Response>
): Promise<Response> {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session || !session.user) {
    return NextResponse.json(
      { error: "You must be signed in to perform this action." },
      { status: 401 }
    );
  }

  return handler(session);
}
