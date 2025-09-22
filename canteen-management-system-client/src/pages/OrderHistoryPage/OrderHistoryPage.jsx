import OrderHistory from "../../components/MainPage/OrderHistory/OrderHistory";
import MainPageLayout from "../../layouts/MainPage/MainPage";
import { Col } from "antd";
import OrderHistoryCardContainer from "../../components/OrderHistoryPage/OrderCardContainer/OrderCardContainer";

const orders = [
    {
      id: "#3759e",
      date: "September 11, 2025",
      time: "12:00 PM - 12:30 PM",
      status: "Pending",
      items: ["1 x Mushroom Soup", "1 x Mashed Potatoes", "1 x Fresh Lemonade"],
      price: "MDL 105",
      action: "Cancel Order",
    },
    {
      id: "#4821b",
      date: "September 8, 2025",
      time: "1:00 PM - 1:30 PM",
      status: "Processed",
      items: ["1 x Grilled Meat", "2 x Garden Salad", "1 x Iced Tea"],
      price: "MDL 153",
      action: "Reorder",
    },
    {
      id: "#2947c",
      date: "September 7, 2025",
      time: "3:30 PM - 4:00 PM",
      status: "Cancelled",
      items: ["1 x Roasted Vegetables Tray", "1 x Mashed Potatoes"],
      price: "MDL 69",
      action: "Reorder",
    },
    {
      id: "#6392h",
      date: "September 8, 2025",
      time: "1:00 PM - 1:30 PM",
      status: "Processed",
      items: ["1 x Grilled Meat", "2 x Garden Salad", "1 x Iced Tea"],
      price: "MDL 153",
      action: "Reorder",
    },
  ];

const OrderHistoryPage = () => {
    return (
        <MainPageLayout>

          <Col xs={24} sm={24} md={16} lg={16} style={{ marginBottom: "20px" }}>
                <OrderHistory />



          </Col>
                      <OrderHistoryCardContainer orders={orders} />

        </MainPageLayout>
    );
}

export default OrderHistoryPage;
