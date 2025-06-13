module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    customerAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
      defaultValue: "pending",
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem);
  };

  return Order;
};
