import { Card, Button, Row, Col, Typography, Divider, Space } from "antd";
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import "./OrderTotal.css";

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
}) => {
  const getCategoryCounts = () => {
    const counts = {};
    selectedItems.forEach((item) => {
      const category = item.category;
      counts[category] = (counts[category] || 0) + (item.qty || 1);
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      soup: "Soup",
      dessert: "Dessert",
      beverages: "Beverage",
      main: "Main Dish",
      side: "Side Dish",
    };
    return (
      categoryMap[category] ||
      category.charAt(0).toUpperCase() + category.slice(1)
    );
  };

  return (
    total > 0 && (
      <Card className="order-total-card">
        <Row className="order-total-header" justify="space-between">
          <Col xs={24} sm={24} md={12}>
            <Title
              level={4}
              style={{ marginBottom: 0 }}
              className="poppins-medium2 title-order-total"
            >
              Order <span style={{ color: "#3577E9" }}>Total</span>
            </Title>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Text className="poppins-regular text-order-date">
              {`Preordering for: ${
                MONTHS[selectedDate.getMonth()]
              } ${selectedDate.getDate()}, ${selectedDate.getFullYear()} • `}
              <span className="poppins-medium text-order-time">
                {selectedTimeSlot?.time || "No time selected"}
              </span>
            </Text>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card className="items-card" size="small">
              {selectedItems.map((item, index) => (
                <div className="item-card" key={index}>
                  <Row
                    justify="space-between"
                    align="flex-start"
                    gutter={[8, 8]}
                  >
                    <Col xs={24} sm={16}>
                      <Text className="poppins-medium title-item">
                        {item.item_name}
                      </Text>
                      <br />
                      <Text className="poppins-regular description-item">
                        {item.item_description}
                      </Text>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Row
                        justify={{ xs: "center", sm: "end" }}
                        align="middle"
                        gutter={8}
                      >
                        <Col>
                          <Button
                            icon={<MinusOutlined />}
                            size="small"
                            shape="square"
                            style={{
                              backgroundColor: "#2563eb",
                              borderColor: "#2563eb",
                              color: "#fff",
                              borderRadius: "0.5rem",
                            }}
                            onClick={() =>
                              handleQuantityChange(
                                item.groupIndex,
                                item.itemIndex,
                                -1
                              )
                            }
                          />
                        </Col>
                        <Col>
                          <Text strong>{item.qty}</Text>
                        </Col>
                        <Col>
                          <Button
                            icon={<PlusOutlined />}
                            size="small"
                            shape="square"
                            style={{
                              backgroundColor: "#2563eb",
                              borderColor: "#2563eb",
                              color: "#fff",
                              borderRadius: "0.5rem",
                            }}
                            onClick={() =>
                              handleQuantityChange(
                                item.groupIndex,
                                item.itemIndex,
                                1
                              )
                            }
                          />
                        </Col>
                        <Col>
                          <Button
                            icon={<CloseOutlined />}
                            size="small"
                            shape="square"
                            style={{
                              backgroundColor: "#fd6464ff",
                              borderColor: "#fd6464ff",
                              color: "#fff",
                              borderRadius: "0.5rem",
                            }}
                            onClick={() =>
                              handleRemoveItem(item.groupIndex, item.itemIndex)
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card className="summary-card" size="small">
              <Text className="poppins-medium total-products-text">
                Total Products
              </Text>
              <ul className="product-list poppins-regular">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <li key={category}>
                    {count} {getCategoryDisplayName(category)}
                    {count > 1 ? "s" : ""}
                  </li>
                ))}
              </ul>
              <Row justify="space-between" align="middle" gutter={[8, 8]}>
                <Col xs={24} sm={17}>
                  <Title
                    level={5}
                    style={{ margin: 0 }}
                    className="poppins-bold total-amount-text"
                  >
                    TOTAL: <span style={{ color: "#3b82f6" }}>{total} MDL</span>
                  </Title>
                </Col>
                <Col xs={24} sm={7}>
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
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Card>
            <Button
              type="primary"
              block
              style={{
                marginTop: "16px",
                fontFamily: "Poppins",
                fontWeight: "500",
                fontStyle: "normal",
              }}
            >
              Confirm Order
            </Button>
          </Col>
        </Row>
      </Card>
    )
  );
};

export default OrderTotal;
