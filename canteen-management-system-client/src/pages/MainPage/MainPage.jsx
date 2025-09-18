import { useState } from "react";
import { Row, Col } from "antd";

import MainPageLayout from "../../layouts/MainPage/MainPage";
import CalendarSlotContainer from "../../components/MainPage/CalendarSlotContainer/CalendarSlotContainer";
import TimeSlots from "../../components/MainPage/TimeSlots/TimeSlots";
import Menu from "../../components/MainPage/Menu/Menu";
import CurrentBalance from "../../components/MainPage/CurrentBalance/CurrentBalance";
import OrderHistory from "../../components/MainPage/OrderHistory/OrderHistory";
import PopUpOrder from "../../components/MainPage/PopUpOrder/PopUpOrder";

const MainPage = () => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekIndex, setWeekIndex] = useState(0);

  const timeSlots = [
    { id: 1, time: "8:00 AM - 8:30 AM", name: "Breakfast" },
    { id: 2, time: "8:30 AM - 9:00 AM", name: "Breakfast" },
    { id: 3, time: "9:00 AM - 9:30 AM", name: "Breakfast" },
    { id: 4, time: "9:30 AM - 10:00 AM", name: "Breakfast" },
    { id: 5, time: "10:00 AM - 10:30 AM", name: "Lunch" },
    { id: 6, time: "10:30 AM - 11:00 AM", name: "Lunch" },
    { id: 7, time: "11:00 AM - 11:30 AM", name: "Lunch" },
    { id: 8, time: "11:30 AM - 12:00 PM", name: "Lunch" },
    { id: 9, time: "12:00 PM - 12:30 PM", name: "Lunch" },
    { id: 10, time: "12:30 PM - 1:00 PM", name: "Lunch" },
    { id: 11, time: "1:00 PM - 1:30 PM", name: "Lunch" },
    { id: 12, time: "1:30 PM - 2:00 PM", name: "Lunch" },
    { id: 13, time: "2:00 PM - 2:30 PM", name: "Lunch" },
    { id: 14, time: "2:30 PM - 3:00 PM", name: "Lunch" },
    { id: 15, time: "3:00 PM - 3:30 PM", name: "Lunch" },
    { id: 16, time: "3:30 PM - 4:00 PM", name: "Lunch" },
    { id: 17, time: "4:00 PM - 4:30 PM", name: "Dinner" },
    { id: 18, time: "4:30 PM - 5:00 PM", name: "Dinner" },
    { id: 19, time: "5:00 PM - 5:30 PM", name: "Dinner" },
  ];

  // ...existing menuItems data...
  const menuItems = {
    previous_week: "?week_offset=1",
    current_week: "?week_offset=0",
    next_week: "?week_offset=3",
    results: [
      {
        id: "11111111-aaaa-bbbb-cccc-111111111111",
        name: "Lunch Soups",
        start_time: "2025-09-16T12:00:00.000Z",
        end_time: "2025-09-16T15:00:00.000Z",
        menu_items: [
          {
            id: "aaaa1111-bbbb-2222-cccc-aaaa1111aaaa",
            quantity: 100,
            item_name: "Tomato Soup",
            item_description: "Classic tomato soup served with croutons.",
            item_base_price: "25",
            remaining_quantity: "98",
            category: "soup",
          },
          {
            id: "bbbb2222-cccc-3333-dddd-bbbb2222bbbb",
            quantity: 80,
            item_name: "Chicken Noodle Soup",
            item_description: "Warm chicken broth with noodles and vegetables.",
            item_base_price: "35",
            remaining_quantity: "79",
            category: "soup",
          },
        ],
        type: "soup",
      },
      {
        id: "22222222-aaaa-bbbb-cccc-222222222222",
        name: "Sweet Desserts",
        start_time: "2025-09-16T18:00:00.000Z",
        end_time: "2025-09-16T22:00:00.000Z",
        menu_items: [
          {
            id: "cccc3333-dddd-4444-eeee-cccc3333cccc",
            quantity: 50,
            item_name: "Chocolate Cake",
            item_description: "Rich and moist chocolate layered cake.",
            item_base_price: "45",
            remaining_quantity: "48",
            category: "dessert",
          },
          {
            id: "dddd4444-eeee-5555-ffff-dddd4444dddd",
            quantity: 60,
            item_name: "Cheesecake",
            item_description: "Creamy cheesecake with a graham cracker crust.",
            item_base_price: "55",
            remaining_quantity: "59",
            category: "dessert",
          },
        ],
        type: "dessert",
      },
      {
        id: "33333333-aaaa-bbbb-cccc-333333333333",
        name: "Refreshing Beverages",
        start_time: "2025-09-16T09:00:00.000Z",
        end_time: "2025-09-16T22:00:00.000Z",
        menu_items: [
          {
            id: "eeee5555-ffff-6666-gggg-eeee5555eeee",
            quantity: 120,
            item_name: "Fresh Lemonade",
            item_description: "Refreshing and citrusy, made with real lemons.",
            item_base_price: "30",
            remaining_quantity: "118",
            category: "beverages",
          },
          {
            id: "ffff6666-gggg-7777-hhhh-ffff6666ffff",
            quantity: 150,
            item_name: "Iced Tea",
            item_description: "Cool black tea with a hint of lemon.",
            item_base_price: "25",
            remaining_quantity: "149",
            category: "beverages",
          },
          {
            id: "gggg7777-hhhh-8888-iiii-gggg7777gggg",
            quantity: 200,
            item_name: "Sparkling Water",
            item_description:
              "Chilled and crisp, perfect to cleanse the palate.",
            item_base_price: "20",
            remaining_quantity: "200",
            category: "beverages",
          },
        ],
        type: "beverages",
      },
    ],
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (time) => {
    setSelectedTimeSlot(time);
  };

  const handleWeekIndexChange = (newIndex) => {
    setWeekIndex(newIndex);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <MainPageLayout>
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <CurrentBalance />
        <Col xs={24} sm={8} md={8}>
          <OrderHistory />
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
        selectedSlot={selectedTimeSlot}
        menuItems={menuItems}
        openPopup={openPopup}
      />
      <PopUpOrder isOpen={isOpen} closePopup={closePopup} />
    </MainPageLayout>
  );
};

export default MainPage;
