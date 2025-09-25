import React from "react";
import { createPortal } from "react-dom";
import "./PopUpOrder.css";
import { Card, Row, Col, Button } from "antd";


const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const PopUpOrder = (props) => {
  const { isOpen, closePopup, selectedDate, selectedTimeSlot, orderData } = props;

  if (!isOpen) return null;

  const orderToShow = orderData ?? null;

  return createPortal(
    <div className="popup-overlay">
      <Card className="popup-box">
        <div className="popup-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
          >
            <path
              d="M52.5 30C52.5 32.9547 51.918 35.8806 50.7873 38.6104C49.6566 41.3402 47.9992 43.8206 45.9099 45.9099C43.8206 47.9992 41.3402 49.6566 38.6104 50.7873C35.8806 51.918 32.9547 52.5 30 52.5C27.0453 52.5 24.1194 51.918 21.3896 50.7873C18.6598 49.6566 16.1794 47.9992 14.0901 45.9099C12.0008 43.8206 10.3434 41.3402 9.21271 38.6104C8.08198 35.8806 7.5 32.9547 7.5 30C7.5 24.0326 9.87053 18.3097 14.0901 14.0901C18.3097 9.87053 24.0326 7.5 30 7.5C35.9674 7.5 41.6903 9.87053 45.9099 14.0901C50.1295 18.3097 52.5 24.0326 52.5 30Z"
              stroke="#306BDD"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22.5 30L26.7075 34.2075C27.145 34.645 27.855 34.645 28.2925 34.2075L37.5 25"
              stroke="#306BDD"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h2 className="popup-title poppins-medium2">
          Order <span className="poppins-bold">CONFIRMED!</span>
        </h2>
        <p className="popup-text poppins-regular">
          Your order has been placed and is being processed.
        </p>
        <div className="popup-divider" />

        <Row className="popup-details" align="top" gutter={[16, 16]}>
          <Col span={8} className="poppins-regular">
            <strong className="poppins-bold">ORDER ID:</strong>{" "}
            {orderToShow.order_no ?? "—"}
          </Col>
          <Col span={8} className="poppins-regular">
            <strong className="poppins-bold">Pick-up Time:</strong>
            <div style={{ marginTop: 6 }}>
              {orderToShow?.reservation_time
                ? new Date(orderToShow.reservation_time).toLocaleString()
                : selectedDate
                ? `${MONTHS[new Date(selectedDate).getMonth()]} ${new Date(
                    selectedDate
                  ).getDate()}, ${new Date(selectedDate).getFullYear()} ${selectedTimeSlot?.time || selectedTimeSlot || ""}`
                : "No date selected"}
            </div>
          </Col>
        </Row>
        <div className="popup-divider" />

        <div className="popup-actions">
          <Button className="btn-ok" onClick={() => closePopup && closePopup()}>
            OK
          </Button>
        </div>
      </Card>
    </div>,
    document.body
  );
};

export default PopUpOrder;
