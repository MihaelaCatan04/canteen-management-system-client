import { Typography, Card, Button } from "antd";
const { Text, Title } = Typography;
import "./Menu.css";
import { useEffect, useState } from "react";
import { Row, Col, Image, Space } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const Menu = ({ selectedTimeSlot, selectedDate, selectedSlot, menuItems }) => {
  const [items, setItems] = useState(menuItems || {});

  const handleQuantityChange = (groupIndex, itemIndex, delta) => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((group, gIdx) =>
        gIdx === groupIndex
          ? {
              ...group,
              menu_items: group.menu_items.map((item, iIdx) =>
                iIdx === itemIndex
                  ? { ...item, qty: Math.max(0, (item.qty || 0) + delta) }
                  : item
              ),
            }
          : group
      ),
    }));
  };
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
  // Flatten all menu_items for selectedItems and total
  const allMenuItems =
    items.results?.flatMap((group) => group.menu_items) || [];
  const selectedItems = allMenuItems.filter((item) => item.qty > 0);
  const total = selectedItems.reduce(
    (sum, item) => sum + Number(item.item_base_price) * item.qty,
    0
  );

  return (
    <div className="menu-container">
      {!selectedTimeSlot ? (
        <div className="no-selection-container">
          <div className="no-selection-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="33"
              height="22"
              viewBox="0 0 33 22"
              fill="none"
            >
              <path
                d="M32.795 9.85901L25.5799 1.46501C25.4093 1.26475 25.1972 1.10347 24.9582 0.992154C24.7193 0.880844 24.459 0.822126 24.1951 0.820007H8.68093C8.14872 0.820007 7.64289 1.06301 7.29612 1.46501L0.0810547 9.85901V14.467H32.795V9.85901Z"
                fill="url(#paint0_linear_2755_13)"
              />
              <path
                d="M30.7505 14.6365L24.4356 7.32549C24.2829 7.15286 24.0947 7.01495 23.8837 6.92113C23.6727 6.82731 23.4439 6.77976 23.2128 6.78174H9.6632C9.19807 6.78174 8.7435 6.97374 8.44046 7.32549L2.12549 14.6365V18.652H30.7505V14.6365Z"
                fill="url(#paint1_linear_2755_13)"
              />
              <path
                d="M32.795 19.7477C32.795 20.3875 32.5055 20.9627 32.0486 21.3482L31.9559 21.4232C31.5937 21.6964 31.1515 21.8439 30.697 21.8432H2.17976C1.92195 21.8432 1.67544 21.7967 1.44778 21.7112L1.3347 21.6662C0.961644 21.5011 0.644689 21.2319 0.422196 20.8913C0.199702 20.5507 0.0812085 20.1532 0.0810547 19.747L0.0810547 9.90924H8.0183C8.89502 9.90924 9.60138 10.627 9.60138 11.4977V11.509C9.60138 12.3805 10.316 13.0832 11.1927 13.0832H21.6833C22.1047 13.0828 22.5088 12.9163 22.807 12.6201C23.1053 12.324 23.2734 11.9223 23.2746 11.503C23.2746 10.6285 23.9817 9.90924 24.8577 9.90924H32.7957L32.795 19.7477Z"
                fill="url(#paint2_linear_2755_13)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_2755_13"
                  x1="16.438"
                  y1="0.820007"
                  x2="16.438"
                  y2="6.95433"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5389F5" />
                  <stop offset="1" stopColor="#416FDC" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2755_13"
                  x1="20.258"
                  y1="18.652"
                  x2="20.258"
                  y2="6.15065"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#DCE9FF" />
                  <stop offset="1" stopColor="#B6CFFF" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_2755_13"
                  x1="16.4384"
                  y1="9.90924"
                  x2="16.4384"
                  y2="21.8432"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#7CA5F7" />
                  <stop offset="1" stopColor="#C4D6FC" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <br />
          <Text
            className="poppins-regular"
            style={{
              fontSize: "clamp(12px, 2.5vw, 14px)",
              marginLeft: "8px",
            }}
          >
            Select Time Slot to get started
          </Text>
        </div>
      ) : (
        items.results &&
        items.results.map((group, groupIndex) => (
          <Card
            key={group.id}
            style={{ borderRadius: "1rem", marginBottom: "20px" }}
          >
            <Row justify="space-between" align="middle" className="menu-header">
              <Col>
                <Title
                  level={4}
                  style={{ margin: 0, color: "#111827" }}
                  className="poppins-medium2"
                >
                  {group.name} -{" "}
                  <span style={{ color: "#3577E9" }}>
                    {selectedTimeSlot.name}
                  </span>
                </Title>
              </Col>
              <Col>
                <Text
                  className="poppins-regular"
                  style={{ lineHeight: "1.25rem", color: "#6B7280" }}
                >
                  {`${
                    MONTHS[selectedDate.getMonth()]
                  } ${selectedDate.getDate()}, ${selectedDate.getFullYear()} • `}
                  <span
                    className="poppins-medium"
                    style={{ lineHeight: "1.25rem", color: "#3b82f6" }}
                  >
                    {selectedTimeSlot.time || ""}
                  </span>
                </Text>
              </Col>
            </Row>

            <Image
              src="../../../images/food.svg"
              alt="drink"
              width="100%"
              style={{ borderRadius: "12px 12px 0 0" }}
              preview={false}
            />

            <Row gutter={16} className="menu-items-row">
              {group.menu_items.map((item, index) => (
                <Col span={8} key={item.id}>
                  <Card className="menu-item-card">
                    {/* Title + Quantity Controls */}
                    <div className="menu-item-header">
                      <Title
                        level={5}
                        style={{
                          lineHeight: "1.5rem",
                          color: "#111827",
                          textAlign: "left",
                        }}
                        className="poppins-medium"
                      >
                        {item.item_name}
                      </Title>

                      <div className="quantity-controls">
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() =>
                            handleQuantityChange(groupIndex, index, 1)
                          }
                          size="small"
                          shape="circle"
                          style={{
                            backgroundColor: "#2563eb",
                            color: "#fff",
                          }}
                        />
                        <Text style={{ lineHeight: "1.5rem", color:"#5F5F5F" }} className="poppins-regular">
                          {item.qty || 0}
                        </Text>
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() =>
                            handleQuantityChange(groupIndex, index, -1)
                          }
                          size="small"
                          shape="circle"
                          style={{
                            backgroundColor: "#2563eb",
                            color: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        marginBottom: "12px",
                        fontSize: "14px",
                        textAlign: "left",
                      }}
                      className="poppins-regular item-description"
                    >
                      {item.item_description}
                    </Text>

                    {/* Price + Add Button */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <Text
                        className="poppins-bold item-price"
                      >
                        MDL {item.item_base_price}
                      </Text>

                      <Button
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: "#2563eb",
                          borderColor: "#2563eb",
                          fontWeight: 500,
                          padding: "0 12px",
                          height: "28px",
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))
      )}
    </div>
  );
};

export default Menu;
