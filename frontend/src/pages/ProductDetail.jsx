import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductStart,
  clearSelectedProduct,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { setBuyNowProduct } from "../store/slices/buyNowSlice";
import { startCheckout } from "../store/slices/checkoutSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductStart(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleBuyNow = () => {
    if (product) {
      // Store the product in buyNow state
      dispatch(
        setBuyNowProduct({
          ...product,
          quantity: 1,
        })
      );
      // Start checkout process
      dispatch(startCheckout());
      // Navigate to checkout
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>Product not found</p>
      </div>
    );
  }

  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.imageUrl || "/api/placeholder/600/600"}
            alt={product.name}
            className="w-full h-96 lg:h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            {product.discountedPrice ? (
              <>
                <span className="text-3xl font-bold text-green-600">
                  ${product.discountedPrice}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price}
                </span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {discountPercentage}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </span>
          </div>

          {/* Additional Details */}
          {product.category && (
            <div>
              <span className="text-sm text-gray-500">Category: </span>
              <span className="text-sm font-medium text-gray-700">
                {product.category}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Product Features */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Product Features
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Free shipping on orders over $50
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                30-day return guarantee
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                1-year warranty included
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
