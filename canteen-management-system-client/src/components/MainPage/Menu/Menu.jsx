import React from 'react';
import { Typography, Card, Button, Spin, Alert, Empty, message } from "antd";
const { Text, Title } = Typography;
import "./Menu.css";
import { useEffect, useState } from "react";
import { Row, Col, Image } from "antd";
import { PlusOutlined, MinusOutlined, ReloadOutlined } from "@ant-design/icons";
import OrderTotal from "../OrderTotal/OrderTotal.jsx";
import useAuth from "../../../hooks/useAuth";
import { authService } from "../../../services/AuthService";
import { httpService } from "../../../services/HttpService";
import { API_ENDPOINTS } from "../../../api/API_ENDPOINTS";

const Menu = ({
  selectedTimeSlot,
  selectedDate,
  menuItems,
  loading,
  error,
  openPopup,
  onRefresh,
  selectedSlot
}) => {
  const [items, setItems] = useState(null);
  const imageMap = {
    "Main Course": "../../../images/main.png",
    "Desserts": "../../../images/sweets.png",
    "Beverages": "../../../images/drinks.png",
    "Salads": "../../../images/salads.png",
    "Appetizers": "../../../images/appet.png"
  }

  useEffect(() => {
    
    if (!menuItems) {
      setItems(null);
      return;
    }

    const transformed = {
      ...menuItems,
      results: (menuItems.results || []).map(menu => ({
        ...menu,
        categories: (menu.categories || []).map(category => ({
          ...category,
          items: (category.items || []).map(item => ({
            ...item,
            qty: 0
          }))
        }))
      }))
    };

    setItems(transformed);
  }, [menuItems]);

  const handleQuantityChange = (menuIndex, categoryIndex, itemIndex, delta) => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((menu, mIdx) =>
        mIdx === menuIndex
          ? {
              ...menu,
              categories: (menu.categories || []).map((category, cIdx) =>
                cIdx === categoryIndex
                  ? {
                      ...category,
                      items: category.items.map((item, iIdx) =>
                        iIdx === itemIndex
                          ? { ...item, qty: Math.max(0, (item.qty || 0) + delta) }
                          : item
                      ),
                    }
                  : category
              ),
            }
          : menu
      ),
    }));
  };

  const addToCart = (menuIndex, categoryIndex, itemIndex) => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((menu, mIdx) =>
        mIdx === menuIndex
          ? {
              ...menu,
              categories: (menu.categories || []).map((category, cIdx) =>
                cIdx === categoryIndex
                  ? {
                      ...category,
                      items: category.items.map((item, iIdx) =>
                        iIdx === itemIndex
                          ? { ...item, qty: item.qty > 0 ? item.qty : 1 }
                          : item
                      ),
                    }
                  : category
              ),
            }
          : menu
      ),
    }));
  };

  const { auth } = useAuth();
  const isVerifiedUser = Boolean(auth?.isVerified ?? auth?.verified ?? false);

  const handleResendVerification = async () => {
    try {
      // Try to get email from auth or profile
      let email = auth?.email || null;
      if (!email) {
        try {
          const profile = await httpService.privateGet(API_ENDPOINTS.USER.PROFILE);
          email = profile?.email || email;
        } catch (err) {
          console.warn("Could not fetch profile to get email for resend", err);
        }
      }

      if (!email) {
        message.error("Unable to determine email address for verification. Please contact support.");
        return;
      }

      await authService.resendVerification(email);
      message.success("Verification email sent (if the address exists).");
    } catch (err) {
      console.error("Resend verification failed", err);
      message.error("Failed to send verification email. Try again later.");
    }
  };

  const selectedItems = [];
  if (items?.results) {
    items.results.forEach((menu, menuIndex) => {
      (menu.categories || []).forEach((category, categoryIndex) => {
        (category.items || []).forEach((item, itemIndex) => {
          if (item.qty > 0) {
            selectedItems.push({
              ...item,
              menuIndex,
              categoryIndex,
              itemIndex,
              menuId: menu.id,
              categoryName: category.name ?? category.id ?? ""
            });
          }
        });
      });
    });
  }

  const total = selectedItems.reduce(
    (sum, item) => sum + Number(item.item_base_price || 0) * item.qty,
    0
  );

  const clearData = () => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((menu) => ({
        ...menu,
        categories: (menu.categories || []).map((category) => ({
          ...category,
          items: (category.items || []).map((item) => ({ ...item, qty: 0 })),
        })),
      })),
    }));
  };

  const handleRemoveItem = (menuIndex, categoryIndex, itemIndex) => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((menu, mIdx) =>
        mIdx === menuIndex
          ? {
              ...menu,
              categories: (menu.categories || []).map((category, cIdx) =>
                cIdx === categoryIndex
                  ? {
                      ...category,
                      items: category.items.map((item, iIdx) =>
                        iIdx === itemIndex ? { ...item, qty: 0 } : item
                      ),
                    }
                  : category
              ),
            }
          : menu
      ),
    }));
  };

  if (loading) {
    return (
      <div className="menu-container">
        <Card style={{ borderRadius: "1rem", marginBottom: "20px" }}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Spin size="large" />
            <Text style={{ marginTop: 16, display: 'block' }}>Loading menu items...</Text>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <Card style={{ borderRadius: "1rem", marginBottom: "20px" }}>
          <div style={{ padding: '20px' }}>
            <Alert
              message="Error loading menu"
              description={error}
              type="error"
              action={
                <Button size="small" danger onClick={onRefresh} icon={<ReloadOutlined />}>
                  Try Again
                </Button>
              }
            />
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedTimeSlot && !selectedSlot) {
    return (
      <div className="menu-container">
        <div className="no-selection-container"></div>
      </div>
    );
  }

  if (!items?.results || items.results.length === 0) {
    return (
      <div className="menu-container">
        <Card style={{ borderRadius: "1rem", marginBottom: "20px" }}>
          <Empty
            description="No menu items available for the selected time slot"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      </div>
    );
  }

  const timeSlots = [
    { id: 1, time: "8:00 AM - 8:30 AM", name: "Breakfast", timeValue: "08:00" },
    { id: 2, time: "8:30 AM - 9:00 AM", name: "Breakfast", timeValue: "08:30" },
    { id: 3, time: "9:00 AM - 9:30 AM", name: "Breakfast", timeValue: "09:00" },
    { id: 4, time: "9:30 AM - 10:00 AM", name: "Breakfast", timeValue: "09:30" },
    { id: 5, time: "10:00 AM - 10:30 AM", name: "Lunch", timeValue: "10:00" },
    { id: 6, time: "10:30 AM - 11:00 AM", name: "Lunch", timeValue: "10:30" },
    { id: 7, time: "11:00 AM - 11:30 AM", name: "Lunch", timeValue: "11:00" },
    { id: 8, time: "11:30 AM - 12:00 PM", name: "Lunch", timeValue: "11:30" },
    { id: 9, time: "12:00 PM - 12:30 PM", name: "Lunch", timeValue: "12:00" },
    { id: 10, time: "12:30 PM - 1:00 PM", name: "Lunch", timeValue: "12:30" },
    { id: 11, time: "1:00 PM - 1:30 PM", name: "Lunch", timeValue: "13:00" },
    { id: 12, time: "1:30 PM - 2:00 PM", name: "Lunch", timeValue: "13:30" },
    { id: 13, time: "2:00 PM - 2:30 PM", name: "Lunch", timeValue: "14:00" },
    { id: 14, time: "2:30 PM - 3:00 PM", name: "Lunch", timeValue: "14:30" },
    { id: 15, time: "3:00 PM - 3:30 PM", name: "Lunch", timeValue: "15:00" },
    { id: 16, time: "3:30 PM - 4:00 PM", name: "Lunch", timeValue: "15:30" },
    { id: 17, time: "4:00 PM - 4:30 PM", name: "Dinner", timeValue: "16:00" },
    { id: 18, time: "4:30 PM - 5:00 PM", name: "Dinner", timeValue: "16:30" },
    { id: 19, time: "5:00 PM - 5:30 PM", name: "Dinner", timeValue: "17:00" },
  ];

  const currentTimeSlot = timeSlots.find(slot => slot.timeValue === selectedTimeSlot) || selectedSlot;
  const timeSlotName = currentTimeSlot?.name || "Selected Time";

  return (
    <div className="menu-container">
      {!isVerifiedUser && (
        <Card style={{ marginBottom: 16 }}>
          <Alert
            message="Account not verified"
            description={
              <div>
                <div>Your account isn't verified yet. You can view the menu but adding to cart is disabled.</div>
                <div style={{ marginTop: 8 }}>
                  <Button type="primary" size="small" onClick={handleResendVerification}>
                    Verify account
                  </Button>
                </div>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>
      )}

      {(items.results || []).map((menu, menuIndex) => (
        (menu.categories || []).map((category, categoryIndex) => {
          const displayTime = menu.start_time && menu.end_time
            ? `${new Date(menu.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(menu.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : currentTimeSlot?.time || currentTimeSlot?.timeValue || "";

          const displayDate = selectedDate ? new Date(selectedDate).toLocaleDateString() : "";

          return (
            <Card
              key={`${menu.id}-${category.name}-${categoryIndex}`}
              style={{ borderRadius: "1rem", marginBottom: "20px" }}
            >
              <Row justify="space-between" align="middle" className="menu-header">
                <Col>
                  <Title level={4} style={{ margin: 0, color: "#111827", fontWeight: "1.75rem" }} className='poppins-medium2'>
                    {category.name} -{" "}
                    <span style={{ color: "#3577E9" }}>
                      {timeSlotName}
                    </span>
                  </Title>
                </Col>

                <Col style={{ textAlign: "right" }}>
                <Row>
                  {displayDate && <Text style={{ display: 'block', color: "#6B7280" }} className='poppins-regular'>{displayDate} • {displayTime && <Text type="secondary" style={{ color: "#3473E5" }} className='poppins-regular'>{currentTimeSlot.time}</Text>}</Text>}</Row>
                </Col>
              </Row> 

              <Image
                src={imageMap[category.name] || "../../../images/main.png"}
                alt={category.name}
                width="100%"
                style={{ borderRadius: "12px 12px 0 0", marginTop: 12 }}
                preview={false}
              />

              <Row gutter={[16, 16]} className="menu-items-row" style={{ marginTop: 12 }}>
                {(category.items || []).map((item, itemIndex) => (
                  <Col xs={24} sm={12} lg={8} key={item.id || `${menuIndex}-${categoryIndex}-${itemIndex}`}>
                    <Card className="menu-item-card">
                      <div className="menu-item-header">
                        <Title level={4} style={{ textAlign: "left", margin: 0 }}>
                          {item.item_name}
                        </Title>

                        <div className="quantity-controls">
                          <Button
                            icon={<MinusOutlined />}
                            onClick={() =>
                              handleQuantityChange(menuIndex, categoryIndex, itemIndex, -1)
                            }
                            size="small"
                            shape="square"
                            disabled={!isVerifiedUser || !item.qty || item.qty <= 0}
                            tabIndex={isVerifiedUser ? 0 : -1}
                            aria-disabled={!isVerifiedUser}
                            style={{
                              backgroundColor: "#2563eb",
                              borderColor: "#2563eb",
                              color: "#fff",
                              borderRadius: "0.5rem",
                            }}
                          />
                          <Text>{item.qty || 0}</Text>
                           <Button
                             icon={<PlusOutlined />}
                             onClick={() =>
                               handleQuantityChange(menuIndex, categoryIndex, itemIndex, 1)
                             }
                             size="small"
                             shape="square"
                             disabled={!isVerifiedUser || parseInt(item.remaining_quantity) <= 0}
                             tabIndex={isVerifiedUser ? 0 : -1}
                             aria-disabled={!isVerifiedUser}
                             style={{
                               backgroundColor: "#2563eb",
                               borderColor: "#2563eb",
                               color: "#fff",
                               borderRadius: "0.5rem",
                             }}
                           />
                        </div>
                      </div>

                      <Text type="secondary" className="item-description">
                        {item.item_description}
                      </Text>

                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text className="poppins-bold item-price">
                            MDL {parseFloat(item.item_base_price || 0).toFixed(2)}
                          </Text>
                        </Col>
                        <Col>
                          {isVerifiedUser ? (
                            <Button
                              onClick={() => addToCart(menuIndex, categoryIndex, itemIndex)}
                              type="primary"
                              size="small"
                              disabled={parseInt(item.remaining_quantity) <= 0}
                              tabIndex={isVerifiedUser ? 0 : -1}
                              aria-disabled={!isVerifiedUser}
                              style={{
                                backgroundColor: "#2563eb",
                                borderColor: "#2563eb",
                                padding: "1rem",
                                borderRadius: "0.5rem",
                              }}
                            >
                              + Add
                            </Button>
                          ) : (
                            <Button type="default" size="small" disabled tabIndex={-1} aria-disabled style={{ padding: "1rem", borderRadius: "0.5rem" }}>
                              View
                            </Button>
                          )}
                        </Col>
                      </Row>

                      {parseInt(item.remaining_quantity) <= 0 && (
                        <Text type="danger" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                          Out of stock
                        </Text>
                      )}
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          );
        })
      ))}

      {isVerifiedUser && (
        <OrderTotal
          selectedItems={selectedItems}
          total={total}
          handleQuantityChange={(menuIndex, categoryIndex, itemIndex, delta) =>
            handleQuantityChange(menuIndex, categoryIndex, itemIndex, delta)
          }
          clearData={clearData}
          selectedDate={selectedDate}
          selectedTimeSlot={currentTimeSlot}
          handleRemoveItem={(menuIndex, categoryIndex, itemIndex) =>
            handleRemoveItem(menuIndex, categoryIndex, itemIndex)
          }
          openPopup={openPopup}
        />
      )}
    </div>
  );
};

export default Menu;