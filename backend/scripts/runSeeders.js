const { sequelize } = require("../models");
const { Category } = require("../models");
require("dotenv").config();

async function seedCategories() {
  try {
    console.log("🌱 Starting database seeding...");
    console.log(`Using database: ${process.env.DB_NAME || "soft_db_final"}`);
    console.log(`Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`User: ${process.env.DB_USER || "postgres"}`);

    // Sync database (be careful with force: true in production)
    await sequelize.sync({ force: false });

    // Check if categories already exist
    const existingCategories = await Category.findAll();
    if (existingCategories.length > 0) {
      console.log("Categories already exist. Skipping seeding...");
      process.exit(0);
    }

    await Category.bulkCreate(
      [
        {
          name: "Electronics",
          description: "Electronic devices and accessories",
        },
        {
          name: "Clothing",
          description: "Fashion and apparel",
        },
        {
          name: "Books",
          description: "Books and publications",
        },
        {
          name: "Home & Living",
          description: "Home decor and furniture",
        },
        {
          name: "Sports",
          description: "Sports equipment and accessories",
        },
      ],
      {
        ignoreDuplicates: true,
        validate: true,
      }
    );

    console.log("✅ Categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
