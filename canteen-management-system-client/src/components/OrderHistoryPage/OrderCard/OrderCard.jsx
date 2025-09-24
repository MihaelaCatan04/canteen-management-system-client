import "./OrderCard.css";
import { Card, Button } from "antd";

const OrderCard = ({ order }) => {
  const statusStyles = {
    Pending: { backgroundColor: "#F1E5C0", color: "#755F3B" },
    Cancelled: { backgroundColor: "#EBBEBE", color: "#782B21" },
    Processed: { backgroundColor: "#B9DEB9", color: "#465742" },
  };

  return (
    <Card className="order-card" style={{ padding: "1rem" }}>
      <div className="order-header">
        <div>
          <p className="order-id poppins-medium2">{order.id}</p>
          <p className="order-date-time poppins-regular">{order.date}</p>
          <p className="order-date-time poppins-regular">{order.time}</p>
        </div>
        <div
          className="order-status poppins-medium"
          style={statusStyles[order.status] || {}}
        >
          {order.status}
        </div>
      </div>

      <div>
        <p className="menu-title poppins-medium2">Menu Items</p>
        <ul className="poppins-medium menu-items">
          {order.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="order-footer">
        <span className="price poppins-bold">{order.price}</span>

        {order.status === "Pending" && (
          <Button
            style={{
              backgroundColor: "#306BDD",
              color: "#fff",
              borderRadius: "0.5rem",
            }}
            className="poppins-medium"
          >
            {order.action}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;
