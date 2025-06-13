module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discountedPrice: {
      type: DataTypes.DECIMAL(10, 2),
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "CategoryId",
    });
    Product.hasMany(models.OrderItem);
  };

  return Product;
};
