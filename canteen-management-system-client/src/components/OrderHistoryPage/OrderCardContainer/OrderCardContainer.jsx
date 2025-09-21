import { Card, Typography } from "antd";
const { Title } = Typography;
import "./OrderCardContainer.css";
import OrderCard from "../OrderCard/OrderCard";

const OrderCardContainer = ({orders}) => {
    return (
    <Card className="order-history-card">
        <Title className="order-history-title poppins-medium2" level={4}>
          Order History
        </Title>
        <div className="order-history-cards">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
      </Card>
);
}
 
export default OrderCardContainer;