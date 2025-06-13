import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-50 bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all">
        {children}
      </div>
    </div>
  );
};

export default Modal;
