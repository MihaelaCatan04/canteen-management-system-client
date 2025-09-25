import "./OrderCard.css";
import { Card, Button } from "antd";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const statusStyles = {
  preparing: { backgroundColor: "#FDE68A", color: "#92400e" },
  pending: { backgroundColor: "#F1E5C0", color: "#755F3B" },
  cancelled: { backgroundColor: "#EBBEBE", color: "#782B21" },
  processed: { backgroundColor: "#B9DEB9", color: "#465742" },
  confirmed: { backgroundColor: "#B9DEB9", color: "#465742" },
  paid: { backgroundColor: "#B9DEB9", color: "#465742" },
  completed: { backgroundColor: "#B9DEB9", color: "#465742" },
};

const formatReservation = (reservation_time) => {
  if (!reservation_time) return { date: "", time: "" };
  const d = new Date(reservation_time);
  const date = `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  const pad = (n) => String(n).padStart(2, "0");
  const sh = d.getHours();
  const sm = d.getMinutes();
  const start = `${pad(sh)}:${pad(sm)}`;

  let eh = sh;
  let em = 0;
  if (sm === 0) em = 30;
  else { em = 0; eh = (sh + 1) % 24; }
  const end = `${pad(eh)}:${pad(em)}`;

  return { date, time: `${start} - ${end}` };
};

const OrderCard = ({ order }) => {
  const { date, time } = formatReservation(order.reservation_time);

  return (
    <Card className="order-card" style={{ padding: "1rem" }}>
      <div className="order-header">
        <div>
          <p className="order-id poppins-medium2">{order.order_no ?? order.id}</p>
          <p className="order-date-time poppins-regular">{date}</p>
          <p className="order-date-time poppins-regular">{time}</p>
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
          {(order.items || []).map((it, i) => (
            <li key={i}>
              {it.item_name ?? it.name ?? String(it)}{it.quantity ? ` × ${it.quantity}` : ""}
            </li>
          ))}
        </ul>
      </div>

      <div className="order-footer">
        <span className="price poppins-bold">MDL {order.total_amount ?? order.price}</span>

        {String(order.status).toLowerCase() === "pending" && (
          <Button
            style={{
              backgroundColor: "#306BDD",
              color: "#fff",
              borderRadius: "0.5rem",
            }}
            className="poppins-medium"
          >
            {order.action ?? "Action"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OrderCard;
