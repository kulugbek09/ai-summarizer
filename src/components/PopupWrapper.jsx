import React from 'react';

const PopupWrapper = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] h-[90%] overflow-y-auto p-6 relative">
        <button
          className="absolute top-4 right-4 text-black text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default PopupWrapper;
