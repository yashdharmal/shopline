import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchProductsStart,
  fetchCategoriesStart,
} from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard";

function Home() {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.products);

  // Safely destructure with defaults
  const {
    products = [],
    categories = [],
    loading = false,
    error = null,
  } = productState || {};

  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    console.log("Selected category:", categoryId); // Debug log
    setSelectedCategory(categoryId);
    if (categoryId) {
      dispatch(fetchProductsStart({ categoryId }));
    } else {
      dispatch(fetchProductsStart());
    }
  };

  // Initial products fetch
  useEffect(() => {
    dispatch(fetchProductsStart());
  }, [dispatch]);

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-r-4 border-b-4 border-blue-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8 min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <p className="text-xl font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white h-[140px]">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMjggNjZMMCA1MEwyOCAzNGwyOCAxNkwyOCA2NnpNMjggMzRMMCA1MEwyOCA2NmwyOC0xNkwyOCAzNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjU2IiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Welcome to ShopLine
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/90">
              Discover amazing products at unbeatable prices
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="w-full -mt-4 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 mx-2 sm:mx-4 mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-6 py-2 rounded-xl transition-all duration-300 text-sm ${
                selectedCategory === null
                  ? "bg-blue-600 text-white shadow-lg transform scale-105 hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
              }`}
            >
              All Products
            </button>
            {safeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-6 py-2 rounded-xl transition-all duration-300 text-sm ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg transform scale-105 hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 px-2 sm:px-4 mb-8">
          {safeProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col min-h-[480px] sm:min-h-[500px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {safeProducts.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 max-w-lg mx-auto shadow-xl border border-gray-100">
              <p className="text-2xl text-gray-700 font-semibold mb-4">
                No products found
              </p>
              <p className="text-gray-500 leading-relaxed">
                Try selecting a different category or check back later for new
                products.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Home as default };

// Add this CSS to your global styles or component styles
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}
`;
