import React, { useState } from "react";
import { Card, Button, Row, Col, Typography, Divider, Space } from "antd";
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import "./OrderTotal.css";
import OrdersService from "../../../services/OrdersService.jsx";

const { Title, Text } = Typography;

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

const OrderTotal = ({
  selectedItems,
  total,
  handleQuantityChange,
  clearData,
  selectedDate,
  selectedTimeSlot,
  handleRemoveItem,
  openPopup,
  onResetSelections,
}) => {
  const items = Array.isArray(selectedItems) ? selectedItems : [];
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const placeOrder = async () => {
    try {
      setErrorMessage(null);
      if (!items.length) {
        setErrorMessage("No items to order");
        return;
      }
      setIsSubmitting(true);

      const menuId = items[0].menuId ?? items[0].menu ?? null;
      const baseDate = selectedDate ? new Date(selectedDate) : new Date();
      let hours = 0,
        minutes = 0;
      const timeValue =
        typeof selectedTimeSlot === "string"
          ? selectedTimeSlot
          : selectedTimeSlot?.time || "";
      if (timeValue && typeof timeValue === "string") {
        const first = timeValue.split("-")[0].trim();
        const match = first.match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/);
        if (match) {
          let h = parseInt(match[1], 10) || 0;
          const m = parseInt(match[2], 10) || 0;
          const ampm = match[3];
          if (ampm) {
            const up = ampm.toUpperCase();
            if (up === "PM" && h < 12) h += 12;
            if (up === "AM" && h === 12) h = 0;
          }
          hours = h;
          minutes = m;
        } else {
          const parts = first.split(":").map((p) => p.trim());
          if (parts.length >= 2) {
            hours = parseInt(parts[0].replace(/\D/g, ""), 10) || 0;
            minutes =
              parseInt((parts[1].match(/\d{1,2}/) || ["0"])[0], 10) || 0;
          }
        }
      }
      baseDate.setHours(hours, minutes, 0, 0);
      const reservation_time = baseDate.toISOString();

      const payload = {
        menu: menuId,
        reservation_time,
        items: items
          .map((it) => ({
            menu_item_id: it.id,
            quantity: Math.max(0, parseInt(it.qty, 10) || 0),
          }))
          .filter((it) => it.quantity > 0),
      };

      if (!payload.menu) {
        setErrorMessage("Missing menu id for the order");
        return;
      }
      if (!payload.items || payload.items.length === 0) {
        setErrorMessage("No items with quantity > 0 to order");
        return;
      }

      const data = await OrdersService.createOrder(payload);
      if (typeof clearData === "function") {
        try {
          clearData();
        } catch (e) {
        }
      }
      if (typeof onResetSelections === "function") {
        try {
          onResetSelections();
        } catch (e) {
        }
      }
      if (typeof openPopup === "function") {
        try {
          openPopup(data, { resetSelections: true });
        } catch (e) {
          openPopup(data);
        }
      }
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err?.message ||
        "Failed to place order";
      setErrorMessage(String(msg));
    }
  };

  const getCategoryCounts = () => {
    const counts = {};
    items.forEach((item) => {
      const qty = Number(item.qty) || 0;
      if (qty <= 0) return;
      const key = (item.categoryName ?? item.category ?? "").toString();
      if (!key) return;
      counts[key] = (counts[key] || 0) + qty;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const totalItemCount = Object.values(categoryCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const getCategoryDisplayName = (category, count) => {
    if (category == null) return "";
    const name = String(category);
    if (typeof count === "number" && count < 2 && name.endsWith("s")) {
      return name.slice(0, -1);
    }
    return name;
  };

  const dateObj = selectedDate ? new Date(selectedDate) : null;
  const dateString = dateObj
    ? `${
        MONTHS[dateObj.getMonth()]
      } ${dateObj.getDate()}, ${dateObj.getFullYear()}`
    : "No date selected";
  const timeString = selectedTimeSlot || "No time selected";


  const resolveForHandlers = (item) => {
    if (
      item &&
      typeof item.menuIndex === "number" &&
      typeof item.categoryIndex === "number" &&
      typeof item.itemIndex === "number"
    ) {
      return {
        type: "nested",
        menuIndex: item.menuIndex,
        categoryIndex: item.categoryIndex,
        itemIndex: item.itemIndex,
      };
    }
    if (
      item &&
      typeof item.groupIndex === "number" &&
      typeof item.itemIndex === "number"
    ) {
      return {
        type: "flattened",
        groupIndex: item.groupIndex,
        itemIndex: item.itemIndex,
      };
    }
    return null;
  };

  if (!items || items.length === 0 || !(total > 0)) return null;

  return (
    <Card className="order-total-card">
      <div className="order-total-inner">
        <Row
          className="order-total-header"
          justify="space-between"
          style={{ width: "100%", marginBottom: "16px", marginRight: "0" }}
        >
          <Col>
            <Title
              level={4}
              style={{ marginBottom: 0, lineHeight: "2rem" }}
              className="poppins-medium2 title-order-total"
            >
              Order <span style={{ color: "#3577E9" }}>Total</span>
            </Title>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Text className="poppins-regular text-order-date">
              {`Preordering for: ${dateString} • `}
              <span className="poppins-medium text-order-time">{selectedTimeSlot.time}</span>
            </Text>
          </Col>
        </Row>

        <Row gutter={[32, 16]} style={{ width: "100%" }}>
          <Col xs={24} lg={16}>
            <Card className="items-card" size="small" style={{ padding: "10px" }}>
              {items.map((item, index) => {
                const resolved = resolveForHandlers(item);
                const qty = Number(item.qty) || 0;
                const remaining = Number(item.remaining_quantity) || 0;

                const onDec = () => {
                  if (!resolved) return;
                  if (resolved.type === "nested") {
                    handleQuantityChange(
                      resolved.menuIndex,
                      resolved.categoryIndex,
                      resolved.itemIndex,
                      -1
                    );
                  } else {
                    handleQuantityChange(
                      resolved.groupIndex,
                      resolved.itemIndex,
                      -1
                    );
                  }
                };

                const onInc = () => {
                  if (!resolved) return;
                  if (resolved.type === "nested") {
                    handleQuantityChange(
                      resolved.menuIndex,
                      resolved.categoryIndex,
                      resolved.itemIndex,
                      1
                    );
                  } else {
                    handleQuantityChange(
                      resolved.groupIndex,
                      resolved.itemIndex,
                      1
                    );
                  }
                };

                const onRemove = () => {
                  if (!resolved) return;
                  if (resolved.type === "nested") {
                    handleRemoveItem(
                      resolved.menuIndex,
                      resolved.categoryIndex,
                      resolved.itemIndex
                    );
                  } else {
                    handleRemoveItem(resolved.groupIndex, resolved.itemIndex);
                  }
                };

                return (
                  <div
                    key={index}
                    style={{
                      padding: "12px 16px",
                      borderBottom:
                        index < items.length - 1 ? "1px solid #f0f0f0" : "none",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "16px" }}>
                      <Text
                        className="poppins-medium"
                        style={{ fontSize: "16px", fontWeight: "500" }}
                      >
                        {item.item_name}
                      </Text>
                      <br />
                      <Text
                        className="poppins-regular"
                        style={{ fontSize: "14px", color: "#6b7280" }}
                      >
                        {item.item_description}
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >
                      <Button
                        icon={<MinusOutlined />}
                        size="small"
                        shape="square"
                        style={{
                          backgroundColor: "#3b82f6",
                          borderColor: "#3b82f6",
                          color: "#fff",
                          width: "32px",
                          height: "32px",
                          borderRadius: "0.5rem",
                        }}
                        onClick={onDec}
                        disabled={qty <= 0}
                      />
                      <Text
                        strong
                        style={{
                          fontSize: "16px",
                          minWidth: "20px",
                          textAlign: "center",
                          display: "inline-block",
                        }}
                      >
                        {qty}
                      </Text>
                      <Button
                        icon={<PlusOutlined />}
                        size="small"
                        shape="square"
                        style={{
                          backgroundColor: "#3b82f6",
                          borderColor: "#3b82f6",
                          color: "#fff",
                          width: "32px",
                          height: "32px",
                          borderRadius: "0.5rem",
                        }}
                        onClick={onInc}
                        disabled={remaining <= 0}
                      />

                      <Button
                        icon={<CloseOutlined />}
                        size="small"
                        shape="square"
                        style={{
                          backgroundColor: "#ef4444",
                          borderColor: "#ef4444",
                          color: "#fff",
                          width: "32px",
                          height: "32px",
                          borderRadius: "0.5rem",
                        }}
                        onClick={onRemove}
                      />
                    </div>
                  </div>
                );
              })}
            </Card>
          </Col>

          <Col xs={24} lg={8} className="right-col">
            <Card className="summary-card" size="small" style={{ marginBottom: 16, minWidth: '300px' }}>
              <div style={{ width: "100%", padding: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <Text
                    className="poppins-medium"
                    style={{ fontSize: "18px", fontWeight: "600" }}
                  >
                    Total Products
                  </Text>
                  <div
                    style={{
                      backgroundColor: "#3b82f6",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                  >
                    {totalItemCount}
                  </div>
                </div>

                <ul
                  className="product-list poppins-regular"
                  style={{ marginBottom: "24px", paddingLeft: "16px", listStyle: "disc" }}
                >
                  {Object.entries(categoryCounts).map(([categoryKey, count]) => (
                    <li
                      key={categoryKey}
                      style={{ marginBottom: "6px", fontSize: "15px" }}
                    >
                      {count} {getCategoryDisplayName(categoryKey, count)}
                    </li>
                  ))}
                </ul>

                <div style={{ marginBottom: "20px" }}>
                  <Title
                    level={5}
                    style={{ margin: 0, fontSize: "20px" }}
                    className="poppins-bold"
                  >
                    TOTAL: <span style={{ color: "#3b82f6" }}>{total} MDL</span>
                  </Title>
                </div>

                <Button
                  className="cancel-btn"
                  onClick={clearData}
                  block
                  style={{
                    backgroundColor: "#D9D9D9",
                    borderColor: "#D9D9D9",
                    color: "#374151",
                    fontFamily: "Poppins",
                    fontWeight: "500",
                    fontStyle: "normal",
                    marginBottom: "16px",
                    height: "40px",
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Card>
            {errorMessage && (
              <div
                className="order-error poppins-regular"
                style={{
                  color: "#b91c1c",
                  background: "#fff1f2",
                  padding: "8px 12px",
                  borderRadius: 6,
                  marginBottom: 12,
                  wordBreak: "break-word",
                }}
              >
                {errorMessage}
              </div>
            )}
            <Button
              type="primary"
              block
              disabled={isSubmitting}
              className="confirm-order-btn"
              style={{
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontStyle: "normal",
                height: "40px",
              }}
              onClick={placeOrder}
            >
              {isSubmitting ? "Placing order..." : "Confirm Order"}
            </Button>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default OrderTotal;
