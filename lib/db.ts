import { neon } from "@neondatabase/serverless";

// One shared SQL function. Every query in the app is raw SQL through this.
export const sql = neon(process.env.DATABASE_URL!);
