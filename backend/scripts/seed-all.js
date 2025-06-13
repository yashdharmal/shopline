const { execSync } = require("child_process");
require("dotenv").config();

console.log("🌱 Starting database seeding...");
console.log(`Using database: ${process.env.DB_NAME || "soft_db_final"}`);
console.log(`Host: ${process.env.DB_HOST || "localhost"}`);
console.log(`User: ${process.env.DB_USER || "postgres"}`);

try {
  // Run all seeders using sequelize-cli
  console.log("Running all seeders...");
  execSync("npx sequelize-cli db:seed:all", { stdio: "inherit" });
  console.log("✅ All seeders completed successfully!");
} catch (error) {
  console.error("❌ Error running seeders:", error.message);
  process.exit(1);
}
