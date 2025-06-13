// backend/models/index.js
const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Category = require("./category")(sequelize, DataTypes);
const Product = require("./product")(sequelize, DataTypes);
const Order = require("./order")(sequelize, DataTypes);
const OrderItem = require("./orderItem")(sequelize, DataTypes);

// Associations
Category.hasMany(Product);
Product.belongsTo(Category);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

module.exports = {
  sequelize,
  Category,
  Product,
  Order,
  OrderItem,
};
