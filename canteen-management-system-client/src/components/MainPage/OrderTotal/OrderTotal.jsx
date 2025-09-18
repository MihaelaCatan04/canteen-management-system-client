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
          <Col>
            <Title
              level={4}
              style={{ marginBottom: 0 }}
              className="poppins-medium2 title-order-total"
            >
              Order <span style={{ color: "#3577E9" }}>Total</span>
            </Title>
          </Col>
          <Col>
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

        <Row gutter={16}>
          <Col span={14}>
            <Card className="items-card" size="small">
              {selectedItems.map((item, index) => (
                <div className="item-card" key={index}>
                  <Row justify="space-between" align="flex-start">
                    <Col span={16}>
                      <Text className="poppins-medium title-item">
                        {item.item_name}
                      </Text>
                      <br />
                      <Text className="poppins-regular description-item">
                        {item.item_description}
                      </Text>
                    </Col>
                    <Col span={8}>
                      <Row justify={"end"} spacing={8}>
                        <Button
                          icon={<MinusOutlined />}
                          size="small"
                          shape="square"
                          style={{
                            marginRight: "8px",
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
                        <Text strong>{item.qty}</Text>
                        <Button
                          icon={<PlusOutlined />}
                          size="small"
                          shape="square"
                          style={{
                            marginLeft: "8px",
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
                        <Button
                          icon={<CloseOutlined />}
                          size="small"
                          shape="square"
                          style={{
                            marginLeft: "8px",
                            backgroundColor: "#fd6464ff",
                            borderColor: "#fd6464ff",
                            color: "#fff",
                            borderRadius: "0.5rem",
                          }}
                          onClick={() =>
                            handleRemoveItem(item.groupIndex, item.itemIndex)
                          }
                        />
                      </Row>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card>
          </Col>

          <Col span={10}>
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
              <Row justify="space-between" align="middle">
                <Col span={17}>
                  <Title level={5} style={{ margin: 0 }} className="poppins-bold total-amount-text">
                    TOTAL: <span style={{ color: "#3b82f6" }}>{total} MDL</span>
                  </Title>
                </Col>
                <Col span={7}>
                  <Button
                    className="cancel-btn"
                    onClick={clearData}
                    classNames="poppins-medium btn-cancel"
                    style = {{ backgroundColor: "#D9D9D9", borderColor: "#D9D9D9", color: "#374151", fontFamily: "Poppins", fontWeight: "500", fontStyle: "normal"}}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Card>
            <Button type="primary" block style={{ marginTop: "16px", fontFamily: "Poppins", fontWeight: "500", fontStyle: "normal"}}>
              Confirm Order
            </Button>
          </Col>
        </Row>
      </Card>
    )
  );
};

export default OrderTotal;
