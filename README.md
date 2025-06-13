# E-commerce Application

A full-stack e-commerce application built with Node.js, Express, Sequelize, PostgreSQL, React, Redux Toolkit, and Redux Saga. This application provides a complete online shopping experience with product management, shopping cart functionality, and order processing.

## Features

### Frontend Features

- 🛍️ **Product Catalog** - Browse and search products with detailed views
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- 💳 **Checkout Process** - Complete order placement with customer details
- 📱 **Responsive Design** - Mobile-friendly interface with Tailwind CSS
- 🔔 **Toast Notifications** - User feedback for all actions
- 👨‍💼 **Product Management** - Admin interface for managing products and categories

### Backend Features

- 📦 **Product Management** - CRUD operations for products and categories
- 🛒 **Order Management** - Complete order processing system
- 🗄️ **Database Management** - Sequelize ORM with PostgreSQL
- 🔄 **Database Seeding** - Automated data population scripts

## Project Structure

```
e-commerce-app/
├── backend/                 # Node.js & Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── migrations/         # Database migrations
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── seeders/           # Database seeders
│   ├── -scripts/          # Utility scripts for seeding
│   └── server.js          # Main server file
└── frontend/               # React application
    ├── public/            # Static assets
    ├── src/
    │   ├── components/    # Reusable React components
    │   ├── pages/         # Application pages
    │   ├── store/         # Redux store configuration
    │   ├── services/      # API service functions
    │   ├── styles/        # CSS and styling files
    │   └── utils/         # Utility functions
    └── dist/              # Build output
```

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Environment**: dotenv
- **CORS**: cors middleware

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Side Effects**: Redux Saga
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Linting**: ESLint

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment file:**
   Create a `.env` file in the backend directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=ecommerce_db
NODE_ENV=development
```

4. **Create PostgreSQL database:**

```sql
CREATE DATABASE ecommerce_db;
```

5. **Run migrations and seed data:**

```bash
# Run database migrations
npm run migrate

# Seed the database with sample data
npm run seed:setup
```

6. **Start the development server:**

```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## API Endpoints

### Products

- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status

## Database Schema

### Models

- **Product**: id, name, description, price, image, categoryId, stock, createdAt, updatedAt
- **Category**: id, name, description, createdAt, updatedAt
- **Order**: id, customerName, customerEmail, customerPhone, totalAmount, status, createdAt, updatedAt
- **OrderItem**: id, orderId, productId, quantity, price, createdAt, updatedAt

## Available Scripts

### Backend Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Run basic seeders
- `npm run seed:setup` - Run all seeders (recommended for initial setup)
- `npm run seed:categories` - Seed categories only
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

### Adding New Features

1. **Backend**: Add models in `/models`, create migrations, update routes and controllers
2. **Frontend**: Create components in `/components`, add pages in `/pages`, manage state with Redux

### Database Management

- Use Sequelize CLI for migrations: `npx sequelize-cli migration:generate --name migration-name`
- Use provided scripts for seeding test data
- Models use Sequelize associations for relationships

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in environment variables
2. Use process manager like PM2: `pm2 start server.js`
3. Set up reverse proxy with Nginx
4. Configure SSL certificates

### Frontend

1. Build the application: `npm run build`
2. Serve the `dist` directory with a web server
3. Configure environment-specific API endpoints

### Demo

https://www.loom.com/share/7314f2fedce545d083d2f6a01015a22f?sid=467cc021-c403-49c7-97bd-1f807e5b2bc1
