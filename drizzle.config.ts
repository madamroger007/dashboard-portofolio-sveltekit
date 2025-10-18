import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

const isProd = process.env.NODE_ENV === "production";

dotenv.config({
  path: isProd ? ".env.production" : ".env.development",
});

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  verbose: true,
  strict: true,
});
