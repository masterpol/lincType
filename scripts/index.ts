import { migrateDataIfNeeded } from "../src/db/migrations";

async function main() {
  console.log("Running migrations...");
  await migrateDataIfNeeded();
  console.log("Migrations completed successfully!");
  process.exit(0);
}

main().catch(error => {
  console.error("Migration failed:", error);
  process.exit(1);
});