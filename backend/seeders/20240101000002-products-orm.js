"use strict";

const { Product, Category } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, get category IDs dynamically using ORM
      const categories = await Category.findAll({
        attributes: ["id", "name"],
        raw: true,
      });

      // Create a category name to ID mapping
      const categoryMap = categories.reduce((map, cat) => {
        map[cat.name] = cat.id;
        return map;
      }, {});

      // Validate that we have categories
      if (categories.length === 0) {
        throw new Error(
          "No categories found! Please run category seeder first."
        );
      }

      // Define products array
      const products = [
        {
          name: "Wireless Bluetooth Headphones",
          description:
            "High-quality wireless headphones with noise cancellation and 30-hour battery life",
          price: 149.99,
          discountedPrice: null,
          imageUrl:
            "https://images.pexels.com/photos/3394656/pexels-photo-3394656.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 25,
          CategoryId: categoryMap["Electronics"],
        },
        {
          name: "Smart Watch Series X",
          description:
            "Feature-rich smartwatch with health monitoring, GPS, and 7-day battery life",
          price: 299.99,
          discountedPrice: 249.99,
          imageUrl:
            "https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 15,
          CategoryId: categoryMap["Electronics"],
        },
        {
          name: "Professional Coffee Maker",
          description:
            "Premium programmable coffee maker with built-in grinder and thermal carafe",
          price: 189.99,
          discountedPrice: null,
          imageUrl:
            "https://images.pexels.com/photos/5591667/pexels-photo-5591667.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 12,
          CategoryId: categoryMap["Home & Kitchen"],
        },
        {
          name: "Stainless Steel Cookware Set",
          description:
            "10-piece professional stainless steel cookware set with non-stick coating",
          price: 249.99,
          discountedPrice: 199.99,
          imageUrl:
            "https://images.pexels.com/photos/5379918/pexels-photo-5379918.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 8,
          CategoryId: categoryMap["Home & Kitchen"],
        },
        {
          name: "Running Shoes Pro",
          description:
            "Professional running shoes with advanced cushioning and breathable material",
          price: 129.99,
          discountedPrice: null,
          imageUrl:
            "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 30,
          CategoryId: categoryMap["Sports & Fitness"],
        },
        {
          name: "Yoga Mat Premium",
          description:
            "Eco-friendly yoga mat with superior grip and extra thickness for comfort",
          price: 49.99,
          discountedPrice: 39.99,
          imageUrl:
            "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 20,
          CategoryId: categoryMap["Sports & Fitness"],
        },
        {
          name: "Designer Leather Jacket",
          description:
            "Premium genuine leather jacket with modern cut and classic styling",
          price: 299.99,
          discountedPrice: null,
          imageUrl:
            "https://images.pexels.com/photos/5886041/pexels-photo-5886041.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 10,
          CategoryId: categoryMap["Fashion & Apparel"],
        },
        {
          name: "Casual Sneakers",
          description: "Comfortable casual sneakers perfect for everyday wear",
          price: 89.99,
          discountedPrice: 69.99,
          imageUrl:
            "https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 35,
          CategoryId: categoryMap["Fashion & Apparel"],
        },
        {
          name: "Programming Fundamentals Book",
          description:
            "Comprehensive guide to programming fundamentals and best practices",
          price: 39.99,
          discountedPrice: null,
          imageUrl:
            "https://images.pexels.com/photos/5904934/pexels-photo-5904934.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 50,
          CategoryId: categoryMap["Books & Education"],
        },
        {
          name: "Wireless Gaming Mouse",
          description:
            "High-precision wireless gaming mouse with RGB lighting and programmable buttons",
          price: 79.99,
          discountedPrice: 59.99,
          imageUrl:
            "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          stock: 22,
          CategoryId: categoryMap["Electronics"],
        },
      ];

      // Validate all CategoryIds before insertion
      const invalidProducts = products.filter((product) => !product.CategoryId);
      if (invalidProducts.length > 0) {
        console.error(
          "Products with invalid CategoryId:",
          invalidProducts.map((p) => p.name)
        );
        console.error("Available categories:", Object.keys(categoryMap));
        throw new Error(
          `Found ${invalidProducts.length} products with null CategoryId. Check category names match exactly.`
        );
      }

      // Using ORM features instead of raw SQL
      await Product.bulkCreate(products, {
        // ORM options
        validate: true,
        ignoreDuplicates: true,
        returning: true,
      });

      console.log("Products seeded successfully using ORM features");
    } catch (error) {
      console.error("Error seeding products:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Using ORM features for cleanup
      await Product.destroy({
        where: {},
        truncate: true,
        cascade: true,
      });

      console.log("Products removed successfully using ORM features");
    } catch (error) {
      console.error("Error removing products:", error);
      throw error;
    }
  },
};
