const { Order, OrderItem, Product } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const { customerDetails, items } = req.body;

    // Validate required customer details
    if (
      !customerDetails ||
      !customerDetails.name ||
      !customerDetails.email ||
      !customerDetails.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Order placement failed",
        error: "Customer details are required (name, email, and address)",
      });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order placement failed",
        error: "Order must contain at least one item",
      });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Create order
    const order = await Order.create({
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerAddress: customerDetails.address,
      totalAmount,
      status: "pending",
    });

    // Create order items
    const orderItems = await Promise.all(
      items.map((item) =>
        OrderItem.create({
          OrderId: order.id,
          ProductId: item.id,
          quantity: item.quantity,
          price: item.price,
        })
      )
    );

    // Update product stock
    await Promise.all(
      items.map((item) =>
        Product.decrement("stock", {
          by: item.quantity,
          where: { id: item.id },
        })
      )
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: {
        order,
        orderItems,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order placement failed",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    await order.update({ status });

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};
