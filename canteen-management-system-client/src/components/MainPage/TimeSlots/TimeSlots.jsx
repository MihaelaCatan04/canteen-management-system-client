import { useState } from "react";
import { Typography } from "antd";
import "./TimeSlots.css";

const { Title, Text } = Typography;

const TimeSlots = ({
  selectedDate: propSelectedDate,
  selectedTimeSlot: propSelectedTimeSlot,
  onTimeSlotSelect: handleSelectedTimeSlot,
  timeSlots,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    propSelectedTimeSlot || null
  );

  const onSelectedTimeSlot = (slotId) => {
    setSelectedTimeSlot(slotId);
    handleSelectedTimeSlot(slotId);
  };

  return (
    <>
      <Title
        level={5}
        style={{
          fontSize: "1.25rem",
        }}
        className="poppins-medium2"
      >
        Available Time Slots - September {propSelectedDate}, 2025
      </Title>
      <div
        className="time-slots-container"
        style={{
          marginBottom: selectedTimeSlot ? "32px" : "0",
        }}
      >
        {timeSlots.map((slot) => (
          <div
            key={slot.id}
            onClick={() => onSelectedTimeSlot(slot.id)}
            className="time-slot"
            style={{
              border:
                selectedTimeSlot === slot.id
                  ? "2px solid #4F46E5"
                  : "1px solid #e8e8e8",
              backgroundColor:
                selectedTimeSlot === slot.id ? "#f0f2ff" : "white",
            }}
          >
            <div className="time-slot-label poppins-medium2"
            >
              {slot.label}
            </div>
            <div className="time-slot-time poppins-regular"
            >
              {slot.time}
            </div>
          </div>
        ))}
      </div>

      {!selectedTimeSlot && (
        <div
          style={{
            textAlign: "center",
            marginTop: "clamp(30px, 6vw, 40px)",
            color: "#666",
          }}
        >
          <div
            style={{
              fontSize: "clamp(32px, 8vw, 48px)",
              marginBottom: "16px",
            }}
          >
            🍽️
          </div>
          <Text className="poppins-regular"
            style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}>
            Select Time Slot to get started
          </Text>
        </div>
      )}
    </>
  );
};

export default TimeSlots;
