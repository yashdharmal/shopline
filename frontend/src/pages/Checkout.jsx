import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createOrderStart,
  clearCurrentOrder,
} from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";
import { clearBuyNowProduct } from "../store/slices/buyNowSlice";
import {
  updateCustomerDetails,
  setErrors,
  clearErrors,
  cancelCheckout,
  startCheckout,
} from "../store/slices/checkoutSlice";
import { showErrorToast } from "../utils/toast";
import OrderSuccessModal from "../components/OrderSuccessModal";

// Add ValidationMessage component at the top of the file
const ValidationMessage = ({ message, type = "error" }) => {
  if (!message) return null;

  const iconClass =
    type === "error"
      ? "fas fa-exclamation-circle text-red-500"
      : "fas fa-check-circle text-green-500";

  const messageClass =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-green-50 text-green-700 border-green-200";

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-2 rounded-md border ${messageClass} text-sm animate-fadeIn mt-1`}
      role="alert"
    >
      <i className={`${iconClass} text-lg`} aria-hidden="true"></i>
      <span>{message}</span>
    </div>
  );
};

// Add styles for animation in the existing style section or create new one
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isActive: isBuyNow, product: buyNowProduct } = useSelector(
    (state) => state.buyNow
  );
  const {
    isCheckoutActive,
    customerDetails,
    errors: checkoutErrors,
  } = useSelector((state) => state.checkout);
  const { loading, error, currentOrder } = useSelector((state) => state.orders);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Determine which items to show in order summary
  const orderItems = isBuyNow ? [buyNowProduct] : items;
  const orderTotalAmount = isBuyNow
    ? parseFloat(buyNowProduct.discountedPrice || buyNowProduct.price)
    : totalAmount;

  // Ensure checkout is active when component mounts
  useEffect(() => {
    if (!isCheckoutActive && !isBuyNow && items.length > 0) {
      dispatch(startCheckout());
    }
  }, [dispatch, isCheckoutActive, isBuyNow, items]);

  // Handle order success
  useEffect(() => {
    if (currentOrder && !loading) {
      setShowSuccessModal(true);
    }
  }, [currentOrder, loading]);

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Clear states
    if (isBuyNow) {
      dispatch(clearBuyNowProduct());
    } else {
      dispatch(clearCart({ silent: true }));
      dispatch(cancelCheckout());
    }
    dispatch(clearCurrentOrder());
    // Navigate to home
    navigate("/", { replace: true });
  };

  // Show empty state if no items
  if (!isBuyNow && (!items || items.length === 0)) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast("Please fill in all required fields");
      return;
    }

    if (orderItems.length === 0) {
      showErrorToast("No items to checkout");
      return;
    }

    // Format the address string
    const fullAddress = `${customerDetails.address}, ${customerDetails.city}, ${customerDetails.state} ${customerDetails.zipCode}, ${customerDetails.country}`;

    const orderData = {
      customerDetails: {
        name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        email: customerDetails.email,
        address: fullAddress,
      },
      items: orderItems.map((item) => ({
        id: item.id,
        quantity: item.quantity || 1,
        price: parseFloat(item.discountedPrice || item.price),
        name: item.name,
        imageUrl: item.imageUrl,
      })),
    };

    dispatch(createOrderStart(orderData));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Format phone number as user types
    if (name === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      dispatch(updateCustomerDetails({ [name]: formattedPhone }));
    } else {
      dispatch(updateCustomerDetails({ [name]: value }));
    }

    // Clear error when user starts typing
    if (checkoutErrors[name]) {
      dispatch(clearErrors());
    }
  };

  const formatPhoneNumber = (value) => {
    // Preserve the + symbol if it exists at the start
    const hasPlus = value.startsWith("+");

    // Remove all non-numeric characters except the leading +
    const phoneNumber = value
      .replace(/[^\d+]/g, "")
      .replace(/^\+*/, hasPlus ? "+" : "");

    // Return the raw number if it's longer than 10 digits or has a + symbol
    if (phoneNumber.length > 10 || hasPlus) {
      return phoneNumber;
    }

    // Format 10-digit numbers with dashes
    let formattedNumber = "";
    if (phoneNumber.length <= 3) {
      formattedNumber = phoneNumber;
    } else if (phoneNumber.length <= 6) {
      formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 10) {
      formattedNumber = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`;
    }

    return formattedNumber;
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validations
    if (!customerDetails.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s'-]{2,30}$/.test(customerDetails.firstName.trim())) {
      newErrors.firstName =
        "First name should be 2-30 characters and contain only letters, spaces, hyphens, and apostrophes";
    }

    if (!customerDetails.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s'-]{2,30}$/.test(customerDetails.lastName.trim())) {
      newErrors.lastName =
        "Last name should be 2-30 characters and contain only letters, spaces, hyphens, and apostrophes";
    }

    // Email validation
    if (!customerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(customerDetails.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Phone validation
    if (!customerDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^\+?[0-9]{7,15}$/;
      if (
        !phoneRegex.test(customerDetails.phone.trim().replace(/[-\s()]/g, ""))
      ) {
        newErrors.phone =
          "Please enter a valid phone number (7-15 digits, can start with +)";
      }
    }

    // Address validation
    if (!customerDetails.address.trim()) {
      newErrors.address = "Address is required";
    } else if (customerDetails.address.trim().length < 5) {
      newErrors.address =
        "Please enter a complete address (minimum 5 characters)";
    } else if (customerDetails.address.trim().length > 100) {
      newErrors.address = "Address is too long (maximum 100 characters)";
    }

    // City validation
    if (!customerDetails.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[a-zA-Z\s'-]{2,50}$/.test(customerDetails.city.trim())) {
      newErrors.city =
        "City should be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes";
    }

    // State validation
    if (!customerDetails.state.trim()) {
      newErrors.state = "State is required";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(customerDetails.state.trim())) {
      newErrors.state =
        "State should be 2-50 characters and contain only letters and spaces";
    }

    // Zip code validation
    if (!customerDetails.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    } else {
      const zipRegex = /^\d{2,9}$/;
      if (!zipRegex.test(customerDetails.zipCode.trim())) {
        newErrors.zipCode = "Please enter a valid zip code (2-9 digits)";
      }
    }

    dispatch(setErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const shippingCost = orderTotalAmount >= 50 ? 0 : 5.99;
  const tax = orderTotalAmount * 0.08;
  const finalTotal = orderTotalAmount + shippingCost + tax;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Details Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Customer Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={customerDetails.firstName}
                      onChange={handleInputChange}
                      className={`input-field w-full px-4 py-2 rounded-lg border ${
                        checkoutErrors.firstName
                          ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      } transition-all duration-200`}
                      maxLength="30"
                      pattern="[a-zA-Z\s'-]{2,30}"
                      title="First name should contain only letters, spaces, hyphens, and apostrophes"
                    />
                    <ValidationMessage message={checkoutErrors.firstName} />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={customerDetails.lastName}
                      onChange={handleInputChange}
                      className={`input-field w-full px-4 py-2 rounded-lg border ${
                        checkoutErrors.lastName
                          ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      } transition-all duration-200`}
                      maxLength="30"
                      pattern="[a-zA-Z\s'-]{2,30}"
                      title="Last name should contain only letters, spaces, hyphens, and apostrophes"
                    />
                    <ValidationMessage message={checkoutErrors.lastName} />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    className={`input-field w-full px-4 py-2 rounded-lg border ${
                      checkoutErrors.email
                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    } transition-all duration-200`}
                    pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                    title="Please enter a valid email address"
                  />
                  <ValidationMessage message={checkoutErrors.email} />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    className={`input-field w-full px-4 py-2 rounded-lg border ${
                      checkoutErrors.phone
                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    } transition-all duration-200`}
                    pattern="^\+?[0-9-\s()]{7,17}"
                    title="Please enter a valid phone number (7-15 digits, can start with +)"
                  />
                  <ValidationMessage message={checkoutErrors.phone} />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerDetails.address}
                    onChange={handleInputChange}
                    className={`input-field w-full px-4 py-2 rounded-lg border ${
                      checkoutErrors.address
                        ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    } transition-all duration-200`}
                    minLength="5"
                    maxLength="100"
                    title="Address should be between 5 and 100 characters"
                  />
                  <ValidationMessage message={checkoutErrors.address} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      className={`input-field w-full px-4 py-2 rounded-lg border ${
                        checkoutErrors.city
                          ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      } transition-all duration-200`}
                      pattern="[a-zA-Z\s'-]{2,50}"
                      maxLength="50"
                      title="City should contain only letters, spaces, hyphens, and apostrophes"
                    />
                    <ValidationMessage message={checkoutErrors.city} />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      className={`input-field w-full px-4 py-2 rounded-lg border ${
                        checkoutErrors.state
                          ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      } transition-all duration-200`}
                      pattern="[a-zA-Z\s]{2,50}"
                      maxLength="50"
                      title="State should contain only letters and spaces"
                    />
                    <ValidationMessage message={checkoutErrors.state} />
                  </div>

                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={customerDetails.zipCode}
                      onChange={handleInputChange}
                      className={`input-field w-full px-4 py-2 rounded-lg border ${
                        checkoutErrors.zipCode
                          ? "border-red-300 focus:border-red-500 focus:ring focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      } transition-all duration-200`}
                      pattern="\d{2,9}"
                      title="Please enter a valid zip code (2-9 digits)"
                      maxLength="9"
                    />
                    <ValidationMessage message={checkoutErrors.zipCode} />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64";
                        e.target.onerror = null;
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity || 1}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      $
                      {parseFloat(item.discountedPrice || item.price).toFixed(
                        2
                      )}
                    </p>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderTotalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        order={currentOrder}
      />
    </>
  );
};

export default Checkout;
