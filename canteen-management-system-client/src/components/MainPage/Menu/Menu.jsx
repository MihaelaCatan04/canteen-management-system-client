import { Typography, Card, Button } from "antd";
const { Text, Title } = Typography;
import "./Menu.css";
import { useEffect, useState } from "react";
import { Row, Col, Image } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import OrderTotal from "../OrderTotal/OrderTotal.jsx";

const Menu = ({ selectedTimeSlot, selectedDate, selectedSlot, menuItems }) => {
  const [items, setItems] = useState(menuItems || {});

  useEffect(() => {
    if (menuItems) {
      setItems(menuItems);
    }
  }, [menuItems]);

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

  const addToCart = (groupIndex, itemIndex) => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((group, gIdx) =>
        gIdx === groupIndex
          ? {
              ...group,
              menu_items: group.menu_items.map((item, iIdx) =>
                iIdx === itemIndex
                  ? { ...item, qty: item.qty > 0 ? item.qty : 1 }
                  : item
              ),
            }
          : group
      ),
    }));
  };

  const selectedItems = [];
  if (items.results) {
    items.results.forEach((group, groupIndex) => {
      group.menu_items.forEach((item, itemIndex) => {
        if (item.qty > 0) {
          selectedItems.push({ ...item, groupIndex, itemIndex });
        }
      });
    });
  }

  const total = selectedItems.reduce(
    (sum, item) => sum + Number(item.item_base_price) * item.qty,
    0
  );

  const clearData = () => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((group) => ({
        ...group,
        menu_items: group.menu_items.map((item) => ({ ...item, qty: 0 })),
      })),
    }));
  };

  const handleRemoveItem = (groupIndex, itemIndex) => {
    setItems((prev) => ({
      ...prev,
      results: prev.results.map((group, gIdx) =>
        gIdx === groupIndex
          ? {
              ...group,
              menu_items: group.menu_items.map((item, iIdx) =>
                iIdx === itemIndex ? { ...item, qty: 0 } : item
              ),
            }
          : group
      ),
    }));
  };

  return (
    <div className="menu-container">
      {!selectedTimeSlot ? (
        <div className="no-selection-container"></div>
      ) : (
        items.results &&
        items.results.map((group, groupIndex) => (
          <Card
            key={group.id}
            style={{ borderRadius: "1rem", marginBottom: "20px" }}
          >
            <Row justify="space-between" align="middle" className="menu-header">
              <Col>
                <Title level={4} style={{ margin: 0, color: "#111827" }}>
                  {group.name} -{" "}
                  <span style={{ color: "#3577E9" }}>
                    {selectedTimeSlot.name}
                  </span>
                </Title>
              </Col>
            </Row>

            <Image
              src="../../../images/food.svg"
              alt="food"
              width="100%"
              style={{ borderRadius: "12px 12px 0 0" }}
              preview={false}
            />

            <Row gutter={[16, 16]} className="menu-items-row">
              {group.menu_items.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <Card className="menu-item-card">
                    <div className="menu-item-header">
                      <Title level={5} style={{ textAlign: "left", margin: 0 }}>
                        {item.item_name}
                      </Title>

                      <div className="quantity-controls">
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() =>
                            handleQuantityChange(groupIndex, index, -1)
                          }
                          size="small"
                          shape="square"
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
                            handleQuantityChange(groupIndex, index, 1)
                          }
                          size="small"
                          shape="square"
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
                          MDL {item.item_base_price}
                        </Text>
                      </Col>
                      <Col>
                        <Button
                          onClick={() => addToCart(groupIndex, index)}
                          type="primary"
                          size="small"
                          style={{
                            backgroundColor: "#2563eb",
                            borderColor: "#2563eb",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                          }}
                        >
                          + Add
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))
      )}

      <OrderTotal
        selectedItems={selectedItems}
        total={total}
        handleQuantityChange={handleQuantityChange}
        clearData={clearData}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        handleRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Menu;
