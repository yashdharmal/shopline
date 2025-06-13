require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "ecommerce_db",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME_TEST || "ecommerce_test_db",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
};
