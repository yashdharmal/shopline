import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const discountPercentage = product.discountedPrice
    ? Math.round(
        ((product.price - product.discountedPrice) / product.price) * 100
      )
    : 0;

  return (
    <div className="h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden">
          <img
            src={product.imageUrl || "/api/placeholder/300/300"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.discountedPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[3.5rem]">
            {product.name}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed min-h-[4.5rem] flex-grow">
            {product.description}
          </p>

          <div className="mt-auto space-y-3">
            <div className="flex flex-col">
              {product.discountedPrice ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.discountedPrice}
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                      SAVE {discountPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg text-gray-500 line-through mr-2">
                      ${product.price}
                    </span>
                    <span className="text-sm text-green-600 font-medium">
                      You save $
                      {(product.price - product.discountedPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-900">
                  ${product.price}
                </div>
              )}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
