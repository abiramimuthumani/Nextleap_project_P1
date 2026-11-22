// The only file that knows how to talk to Neon.
// Everything else asks it for data.

import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export function db() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to .env.local (locally) or Vercel project settings (in production).");
  }
  if (!client) client = neon(connectionString);
  return client;
}
