// Run with: npm run db:setup
// This script is an errand boy. It carries SQL from your laptop to Neon.
// It contains no product logic at all.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing. Put it in .env.local first.");
  process.exit(1);
}

const sql = neon(connectionString);

function statements(file) {
  return readFileSync(join(root, "db", file), "utf8")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.split("\n").every((line) => line.trim().startsWith("--") || line.trim() === ""));
}

async function run(file) {
  for (const statement of statements(file)) {
    await sql.query(statement);
  }
  console.log(`  applied ${file}`);
}

console.log("Resetting the database so the starting point is predictable...");
await sql.query("DROP TABLE IF EXISTS reviews");
await sql.query("DROP TABLE IF EXISTS restaurants");

console.log("Creating tables...");
await run("schema.sql");

console.log("Adding the seed data...");
await run("seed.sql");

const restaurants = await sql.query("SELECT * FROM restaurants ORDER BY id");
const reviews = await sql.query("SELECT * FROM reviews ORDER BY created_at");

console.log("\nrestaurants");
console.table(restaurants);
console.log("\nreviews");
console.table(reviews);
console.log("\nDone.");
