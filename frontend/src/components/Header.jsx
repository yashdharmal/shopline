import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-blue-600"
                >
                  <path
                    d="M4 4h2.5l3 12h9l3-8H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="10"
                    cy="20"
                    r="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="20"
                    r="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M15 8l-3 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                ShopLine
              </span>
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="flex-grow flex justify-center">
            <nav className="flex items-center gap-32">
              <Link
                to="/"
                className="px-6 py-2.5 text-base font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 hover:shadow-md border border-transparent hover:border-blue-100 relative group"
              >
                <span className="relative inline-flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Home
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </span>
              </Link>
              <Link
                to="/manage-products"
                className="px-6 py-2.5 text-base font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-lg hover:bg-blue-50 hover:shadow-md border border-transparent hover:border-blue-100 relative group"
              >
                <span className="relative inline-flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Manage Products
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </span>
              </Link>
            </nav>
          </div>

          {/* Cart Icon */}
          <div className="flex-shrink-0">
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-blue-50 rounded-full transition-all duration-200 hover:shadow-md group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
