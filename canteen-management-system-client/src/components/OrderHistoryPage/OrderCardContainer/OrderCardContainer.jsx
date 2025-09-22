import { Card, Typography } from "antd";
const { Title } = Typography;
import "./OrderCardContainer.css";
import OrderCard from "../OrderCard/OrderCard";

const OrderCardContainer = ({ orders }) => {
  return (
    <Card
      className="order-history-card"
      style={{
        marginBottom: "20px",
        borderRadius: "1.5rem",
        border: "1px solid #E5E7EB",
        margin: 0,
        padding: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Title className="order-history-title poppins-medium2" level={4}>
        Order History
      </Title>
      <div
        className="order-history-cards"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}
      >
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </Card>
  );
};

export default OrderCardContainer;
