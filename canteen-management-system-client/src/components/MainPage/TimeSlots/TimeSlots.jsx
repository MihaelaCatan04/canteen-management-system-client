import { useState } from "react";
import { Typography } from "antd";
import "./TimeSlots.css";
import { Card } from "antd";

const { Title, Text } = Typography;

const TimeSlots = ({
  selectedDate: propSelectedDate,
  selectedTimeSlot: propSelectedTimeSlot,
  onTimeSlotSelect: handleSelectedTimeSlot,
  timeSlots: timeSlots,
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    propSelectedTimeSlot || null
  );

  const slotsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(timeSlots.length / slotsPerPage);
  const startIndex = currentPage * slotsPerPage;
  const endIndex = startIndex + slotsPerPage;
  const currentSlots = timeSlots.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const onSelectedTimeSlot = (time) => {
    setSelectedTimeSlot(time);
    handleSelectedTimeSlot(time);
  };

  return (
    <Card style={{ borderRadius: "1rem", marginBottom: "20px" }}>
    <div className="time-slots-wrapper">
      <div>
        <Title
          level={5}
          style={{
            fontSize: "1.25rem",
            marginTop: "0",
          }}
          className="poppins-medium2"
        >
          {`Available Time Slots - ${
            propSelectedDate instanceof Date
              ? `September ${propSelectedDate.getDate()}, ${propSelectedDate.getFullYear()}`
              : "No Date Selected"
          }`}
        </Title>
        <div>
          <div className="time-slots-navigation">
            {/* Previous Button */}
            <button
              className="button"
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              style={{
                display: currentPage === 0 ? "none" : "flex",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
              >
                <path
                  d="M0.292969 6.29841C-0.0976562 6.68904 -0.0976562 7.32341 0.292969 7.71404L6.29297 13.714C6.68359 14.1047 7.31797 14.1047 7.70859 13.714C8.09922 13.3234 8.09922 12.689 7.70859 12.2984L2.41484 7.00466L7.70547 1.71091C8.09609 1.32029 8.09609 0.685913 7.70547 0.295288C7.31484 -0.0953369 6.68047 -0.0953369 6.28984 0.295288L0.289844 6.29529L0.292969 6.29841Z"
                  fill="#4B5563"
                />
              </svg>
            </button>

            <div
              className="time-slots-container"
              style={{
                flex: 1,
                padding: "0px",
              }}
            >
              {currentSlots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => onSelectedTimeSlot(slot)}
                  className="time-slot"
                  style={{
                    border:
                      selectedTimeSlot && selectedTimeSlot.time === slot.time
                        ? "2px solid #1E42B1"
                        : "1px solid #EFF6FF",
                    backgroundColor:
                      selectedTimeSlot && selectedTimeSlot.time === slot.time ? "#EFF6FF" : "white",
                    padding: "0px",
                  }}
                >
                  <div className="time-slot-name poppins-medium2"
                    style={{
                      color: selectedTimeSlot && selectedTimeSlot.time === slot.time ? "#1E42B1" : "#111827",
                    }}
                  >
                    {slot.name}
                  </div>
                  <div className="time-slot-time poppins-regular"
                    style={{
                      color: selectedTimeSlot && selectedTimeSlot.time === slot.time ? "#1E42B1" : "#4B5563",
                    }}
                  >
                    {slot.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              className="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              style={{
                display: currentPage === totalPages - 1 ? "none" : "flex",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="14"
                viewBox="0 0 8 14"
                fill="none"
              >
                <path
                  d="M7.70713 6.29841C8.09775 6.68904 8.09775 7.32341 7.70713 7.71404L1.70713 13.714C1.3165 14.1047 0.682129 14.1047 0.291504 13.714C-0.0991211 13.3234 -0.0991211 12.689 0.291504 12.2984L5.58525 7.00466L0.294629 1.71091C-0.0959961 1.32029 -0.0959961 0.685913 0.294629 0.295288C0.685254 -0.0953369 1.31963 -0.0953369 1.71025 0.295288L7.71025 6.29529L7.70713 6.29841Z"
                  fill="#4B5563"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Card>
  );
};

export default TimeSlots;
