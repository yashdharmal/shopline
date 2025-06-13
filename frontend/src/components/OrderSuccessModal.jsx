import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccessModal = ({ isOpen, onClose, order }) => {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer1, timer2;
    if (isOpen && order) {
      // Set timeout for exit animation
      timer1 = setTimeout(() => {
        setIsExiting(true);
      }, 2700);

      // Set timeout for closing and navigation
      timer2 = setTimeout(() => {
        onClose();
        navigate("/", { replace: true });
      }, 3000);
    }
    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [isOpen, order, onClose, navigate]);

  // Format amount safely
  const formatAmount = (amount) => {
    if (typeof amount === "number") {
      return amount.toFixed(2);
    }
    if (typeof amount === "string") {
      const num = parseFloat(amount);
      return isNaN(num) ? "0.00" : num.toFixed(2);
    }
    return "0.00";
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 transition-opacity duration-300"></div>

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 
          ${isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100"}
          hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] ease-out`}
      >
        {/* Success Animation Container */}
        <div className="flex items-center space-x-6 mb-8">
          <div
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 
            animate-[bounce_1s_ease-in-out] shadow-lg shadow-green-100"
          >
            <svg
              className="w-10 h-10 text-green-600 transform animate-[scale_0.5s_ease-in-out_forwards]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
                className="animate-[dash_2s_ease-in-out_forwards]"
                style={{ strokeDasharray: "90,150", strokeDashoffset: "-35" }}
              />
            </svg>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Thank you for your purchase!
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100 shadow-inner">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Order ID</span>
              <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                #{order.id}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Total Amount</span>
              <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                ${formatAmount(order.totalAmount)}
              </span>
            </div>
            {order.items && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Items</span>
                <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full shadow-sm">
                  {order.items.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Redirect Message */}
        <p className="text-center text-gray-600 mb-6 font-medium">
          Redirecting to home page...
        </p>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-progress 
            transition-all duration-300 ease-in-out"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
