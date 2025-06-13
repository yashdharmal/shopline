"use strict";

const { Category } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Using ORM features instead of raw SQL
      await Category.bulkCreate(
        [
          {
            name: "Electronics",
            description:
              "Electronic devices, gadgets, smartphones, laptops, and tech accessories",
          },
          {
            name: "Fashion & Apparel",
            description:
              "Clothing, shoes, accessories, and fashion items for men and women",
          },
          {
            name: "Home & Kitchen",
            description:
              "Home appliances, kitchen essentials, furniture, and home décor items",
          },
          {
            name: "Sports & Fitness",
            description:
              "Sports equipment, fitness gear, outdoor activities, and wellness products",
          },
          {
            name: "Books & Education",
            description:
              "Books, educational materials, stationery, and learning resources",
          },
        ],
        {
          // ORM options
          ignoreDuplicates: true, // Skip duplicates if any exist
          validate: true, // Validate data before insertion
          returning: true, // Return the created instances
        }
      );

      console.log("Categories seeded successfully using ORM features");
    } catch (error) {
      console.error("Error seeding categories:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Using ORM features for cleanup
      await Category.destroy({
        where: {
          name: [
            "Electronics",
            "Fashion & Apparel",
            "Home & Kitchen",
            "Sports & Fitness",
            "Books & Education",
          ],
        },
        force: true, // Permanent deletion
      });

      console.log("Categories removed successfully using ORM features");
    } catch (error) {
      console.error("Error removing categories:", error);
      throw error;
    }
  },
};
