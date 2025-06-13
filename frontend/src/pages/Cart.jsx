import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import { startCheckout } from "../store/slices/checkoutSlice";
import { showErrorToast } from "../utils/toast";
import ConfirmationModal from "../components/ConfirmationModal";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
  });

  const handleRemoveItem = (id) => {
    setDeleteModal({ isOpen: true, itemId: id });
  };

  const confirmRemoveItem = () => {
    dispatch(removeFromCart(deleteModal.itemId));
    setDeleteModal({ isOpen: false, itemId: null });
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showErrorToast("Your cart is empty");
      return;
    }

    // Start checkout process
    dispatch(startCheckout());
    navigate("/checkout");
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg
            className="w-24 h-24 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
            ></path>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some products to get started!
          </p>
          <Link to="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
        onConfirm={confirmRemoveItem}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
      />

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button onClick={handleClearCart} className="btn-danger">
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl || "/api/placeholder/100/100"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <Link
                        to={`/product/${item.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${item.discountedPrice || item.price}
                          </span>
                          {item.discountedPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.price}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${item.totalPrice?.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm mt-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items ({totalQuantity})</span>
                  <span className="font-semibold">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {totalAmount >= 50 ? "Free" : "$5.99"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">
                    ${(totalAmount * 0.08).toFixed(2)}
                  </span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      totalAmount +
                      (totalAmount >= 50 ? 0 : 5.99) +
                      totalAmount * 0.08
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full mt-6 py-3 text-lg"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center text-blue-600 hover:text-blue-800 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
