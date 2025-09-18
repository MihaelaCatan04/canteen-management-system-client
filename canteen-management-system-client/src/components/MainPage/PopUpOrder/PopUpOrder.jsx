import React from "react";
import { createPortal } from "react-dom";
import "./PopUpOrder.css"; // Import the styles

const PopUpOrder = ({ isOpen, closePopup }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-box">
        {/* Check icon */}
        <div className="popup-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="popup-title">Order CONFIRMED!</h2>
        <p className="popup-text">
          Your order has been placed and is being processed.
        </p>

        <div className="popup-divider"></div>

        {/* Order details */}
        <div className="popup-details">
          <div>
            <p><strong>ORDER ID:</strong> #3823e</p>
          </div>
          <div>
            <p><strong>Pick-up Time:</strong></p>
            <p>September 11, 2025</p>
            <p>12:00 PM - 12:30 PM</p>
          </div>
        </div>

        <div className="popup-actions">
          <button onClick={closePopup} className="btn btn-ok">OK</button>
          <button onClick={closePopup} className="btn btn-close">Close</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopUpOrder;
