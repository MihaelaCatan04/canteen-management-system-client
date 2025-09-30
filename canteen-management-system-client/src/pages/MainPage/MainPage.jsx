import { useState } from "react";
import { Row, Col } from "antd";

import MainPageLayout from "../../layouts/MainPage/MainPage";
import CalendarSlotContainer from "../../components/MainPage/CalendarSlotContainer/CalendarSlotContainer";
import TimeSlots from "../../components/MainPage/TimeSlots/TimeSlots";
import Menu from "../../components/MainPage/Menu/Menu";
import CurrentBalance from "../../components/MainPage/CurrentBalance/CurrentBalance";
import OrderHistory from "../../components/MainPage/OrderHistory/OrderHistory";
import PopUpOrder from "../../components/MainPage/PopUpOrder/PopUpOrder";
import { useNavigate } from "react-router-dom";
import { useMenus } from "../../hooks/useMenus";

const MainPage = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekIndex, setWeekIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  
  const navigate = useNavigate();

  const { menuItems, loading: menuLoading, error: menuError, refetch } = useMenus(selectedDate, selectedTimeSlot, weekIndex);
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

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot.timeValue || timeSlot);
  };

  const handleWeekIndexChange = (newIndex) => {
    setWeekIndex(newIndex);
  };

  const openPopup = (data = null) => {
    setOrderData(data);
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
    setOrderData(null);
  };
  
  const handleOrderHistoryClick = () => {
    navigate("/order-history");
  };
  
  return (
    <MainPageLayout>
      <Row
        gutter={[16, 16]}
        style={{ marginBottom: "20px", alignItems: "stretch" }}
      >
        <CurrentBalance />
        <Col xs={24} sm={8} md={8} style={{ display: "flex" }}>
          <OrderHistory onClick={handleOrderHistoryClick} />
        </Col>
      </Row>

      <CalendarSlotContainer
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        setWeekIndex={handleWeekIndexChange}
      />

      <TimeSlots
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        onTimeSlotSelect={handleTimeSlotSelect}
        timeSlots={timeSlots}
      />

      <Menu
        selectedTimeSlot={selectedTimeSlot}
        selectedDate={selectedDate}
        loading={menuLoading}
        error={menuError}
        menuItems={menuItems}
        openPopup={openPopup}
        onRefresh={refetch}
      />
      
      <PopUpOrder
        isOpen={isOpen}
        closePopup={closePopup}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        orderData={orderData}
      />
    </MainPageLayout>
  );
};

export default MainPage;