# Database Seeders

This directory contains Sequelize seeders for populating the database with initial data using **ORM features only** (no raw SQL).

## 🚀 Quick Start - One Command

### **Single Command to Seed Everything:**

```bash
npm run seed:all
```

This command will:

1. ✅ Create 5 categories (Electronics, Fashion & Apparel, Home & Kitchen, Sports & Fitness, Books & Education)
2. ✅ Create 10 products with proper category relationships
3. ✅ Handle dependencies automatically (categories first, then products)
4. ✅ Use ORM features throughout (no raw SQL)

### **Alternative Commands:**

```bash
npm run seed:setup        # Same as seed:all
npm run seed:categories   # Categories only
npm run seed:undo:all     # Remove all seeded data
```

## Available Seeders

### 1. Category Seeder (`20241201000001-category-seeder.js`)

### 2. Products Seeder (`20240101000002-products-orm.js`)

## Category Seeder

### Overview

The category seeder (`20241201000001-category-seeder.js`) populates the database with 5 predefined categories using **Sequelize ORM features** (no raw SQL).

### Categories Included

1. **Electronics** - Electronic devices, gadgets, smartphones, laptops, and tech accessories
2. **Fashion & Apparel** - Clothing, shoes, accessories, and fashion items for men and women
3. **Home & Kitchen** - Home appliances, kitchen essentials, furniture, and home décor items
4. **Sports & Fitness** - Sports equipment, fitness gear, outdoor activities, and wellness products
5. **Books & Education** - Books, educational materials, stationery, and learning resources

### ORM Features Used

- ✅ `Category.bulkCreate()` - Using model methods instead of raw SQL
- ✅ `Category.destroy()` - ORM-based deletion for rollback
- ✅ Data validation with `validate: true`
- ✅ Duplicate handling with `ignoreDuplicates: true`
- ✅ Return instances with `returning: true`
- ✅ Proper error handling and logging

### Usage

#### Method 1: Using Sequelize CLI (Recommended)

```bash
# Run the specific category seeder
npx sequelize-cli db:seed --seed 20241201000001-category-seeder.js

# Run all seeders
npm run seed:all

# Undo the last seeder
npm run seed:undo

# Undo all seeders
npm run seed:undo:all
```

#### Method 2: Using Standalone Script

```bash
# Run the category seeder script
npm run seed:categories

# Or directly
node scripts/seed-categories.js
```

### Key Features

1. **ORM-First Approach**: Uses Sequelize model methods instead of raw SQL queries
2. **Duplicate Prevention**: Handles existing data gracefully
3. **Validation**: Validates data before insertion
4. **Error Handling**: Comprehensive error handling with detailed logging
5. **Rollback Support**: Proper down method for undoing changes

### Development Guidelines

When creating new seeders:

- Always use ORM features (`Model.bulkCreate()`, `Model.destroy()`, etc.)
- Avoid raw SQL queries (`queryInterface.bulkInsert()`)
- Include proper validation
- Add comprehensive error handling
- Implement proper rollback functionality
- Use descriptive naming conventions

### Example Usage in Code

```javascript
const { Category } = require("../models");

// Fetch all categories
const categories = await Category.findAll();

// Create new category
const newCategory = await Category.create({
  name: "New Category",
  description: "Category description",
});
```

### Troubleshooting

**Error: Cannot find module '../models'**

- Ensure you're running from the backend directory
- Check that the models are properly exported

**Error: Duplicate entry**

- The seeder includes duplicate prevention
- Use `--force` flag if you need to recreate data

**Error: Validation failed**

- Check that category names are unique
- Ensure required fields are provided

## Products Seeder

### Overview

The products seeder (`20240101000002-products-orm.js`) populates the database with sample products using **Sequelize ORM features**. It dynamically fetches category IDs to ensure proper relationships.

### Products Included

- Electronics: Headphones, Smart Watch, Gaming Mouse
- Home & Kitchen: Coffee Maker, Cookware Set
- Sports & Fitness: Running Shoes, Yoga Mat
- Fashion & Apparel: Leather Jacket, Sneakers
- Books & Education: Programming Book

### ORM Features Used

- ✅ `Product.bulkCreate()` - Using model methods instead of raw SQL
- ✅ `Category.findAll()` - Dynamic category ID lookup
- ✅ `Product.destroy()` - ORM-based deletion for rollback
- ✅ Data validation and duplicate handling

### Usage

```bash
# Run products seeder (after categories)
npx sequelize-cli db:seed --seed 20240101000002-products-orm.js
```

## ✅ Problem Solved

### **Previous Issue:**

- ❌ CategoryId was null in products seeder
- ❌ Had to run seeders in correct order manually
- ❌ Complex dependency management

### **Current Solution:**

- ✅ **Single command handles everything**: `npm run seed:all`
- ✅ **Automatic dependency resolution**: Categories seeded before products
- ✅ **Proper CategoryId mapping**: Dynamic lookup ensures valid relationships
- ✅ **Error handling**: Clear messages if dependencies are missing

## ⚠️ Important Notes

- **Use `npm run seed:all`** - This is the recommended way to seed your database
- All seeders use ORM features instead of raw SQL
- Dependencies are handled automatically
- Duplicate seeders have been removed for consistency
