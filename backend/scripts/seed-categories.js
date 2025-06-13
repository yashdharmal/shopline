const { execSync } = require("child_process");
require("dotenv").config();

console.log("🌱 Starting category seeding...");
console.log(`Using database: ${process.env.DB_NAME || "soft_db_final"}`);
console.log(`Host: ${process.env.DB_HOST || "localhost"}`);
console.log(`User: ${process.env.DB_USER || "postgres"}`);

try {
  // Run only the category seeder
  console.log("Running category seeder...");
  execSync(
    "npx sequelize-cli db:seed --seed 20240101000001-category-seeder.js",
    {
      stdio: "inherit",
    }
  );
  console.log("✅ Category seeder completed successfully!");
} catch (error) {
  console.error("❌ Error running category seeder:", error.message);
  process.exit(1);
}
