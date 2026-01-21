import React, { useEffect, useState } from "react";
import OrderHistory from "../../components/MainPage/OrderHistory/OrderHistory";
import MainPageLayout from "../../layouts/MainPage/MainPage";
import { Col } from "antd";
import OrderHistoryCardContainer from "../../components/OrderHistoryPage/OrderCardContainer/OrderCardContainer";
import { orderService } from "../../services/OrderService";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await orderService.getOrders();
        if (!mounted) return;
        setOrders(data?.results);
      } catch (e) {
        if (!mounted) return;
        setOrders(sampleOrders);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <MainPageLayout>
      <Col xs={24} sm={24} md={16} lg={16} style={{ marginBottom: "20px" }}>
        <OrderHistory />
      </Col>
      <OrderHistoryCardContainer orders={orders} loading={loading} />
    </MainPageLayout>
  );
};

export default OrderHistoryPage;
