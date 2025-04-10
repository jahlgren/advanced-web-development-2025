import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db";
import { user } from "@/models/user";
import { account } from "@/models/account";
import { session } from "@/models/session";

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
