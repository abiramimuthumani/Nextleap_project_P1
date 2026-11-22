// Applies db/schema.sql then db/seed.sql to the database in DATABASE_URL,
// then prints the rows so you can see exactly what is stored.
import { readFileSync, existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const sql = neon(process.env.DATABASE_URL);

for (const file of ["db/schema.sql", "db/seed.sql"]) {
  const statements = readFileSync(file, "utf8")
    .split("\n").filter((l) => !l.trim().startsWith("--")).join("\n")
    .split(";").map((s) => s.trim()).filter(Boolean);
  for (const statement of statements) await sql.query(statement);
  console.log(`Applied ${file}`);
}

console.log("\nrestaurants:"); console.table(await sql.query("SELECT * FROM restaurants ORDER BY id"));
console.log("reviews:");      console.table(await sql.query("SELECT * FROM reviews ORDER BY id"));
