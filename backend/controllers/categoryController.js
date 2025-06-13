const { Category } = require("../models");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category creation failed",
      error: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    await category.update(req.body);

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: "Category deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
