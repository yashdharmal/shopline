const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

// Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;

// Database sync and server start
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
