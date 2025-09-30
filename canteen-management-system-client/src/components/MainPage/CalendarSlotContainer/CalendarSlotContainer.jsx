import { useState, useEffect } from "react";
import { Card, Button, Typography, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
import "./CalendarSlotContainer.css";
import { menusService } from "../../../services/MenusService";

const CalendarSlotContainer = ({
  selectedDate: propSelectedDate,
  onDateSelect,
  setWeekIndex,
}) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || today);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");
  const [weekDates, setWeekDates] = useState([]);

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    let name = MONTHS[today.getMonth()];
    setCurrentMonth(name);
  }, [today]);

  useEffect(() => {
    if (propSelectedDate !== undefined && propSelectedDate !== selectedDate) {
      setSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  useEffect(() => {
    const generateCalendarDates = () => {
      const currentYear = today.getFullYear();
      const currentMonthIndex = today.getMonth();
      const todayDate = today.getDate();

      const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
      let firstDayWeekday = firstDayOfMonth.getDay();
      firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

      const lastDayOfMonth = new Date(currentYear, currentMonthIndex + 1, 0);
      const lastDate = lastDayOfMonth.getDate();

      const dates = [];

      const weekOffset = menusService.calculateWeekOffset(selectedDate);
      setCurrentWeekIndex(weekOffset);

      if (firstDayWeekday > 0) {
        const prevMonthLastDay = new Date(
          currentYear,
          currentMonthIndex,
          0
        ).getDate();
        for (let i = firstDayWeekday - 1; i >= 0; i--) {
          const day = prevMonthLastDay - i;
          const dayDate = new Date(currentYear, currentMonthIndex - 1, day);
          dates.push({
            day: day,
            label: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
              dayDate.getDay()
            ],
            status: "Past",
            isCurrentMonth: false,
            date: dayDate,
          });
        }
      }

      for (let day = 1; day <= lastDate; day++) {
        let status = "Available";
        if (day < todayDate) {
          status = "Past";
        } else if (day === todayDate) {
          status = "Today";
        }

        const dayDate = new Date(currentYear, currentMonthIndex, day);
        dates.push({
          day: day,
          label: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
            dayDate.getDay()
          ],
          status: status,
          isCurrentMonth: true,
          date: dayDate,
        });
      }

      const lastDayWeekday = lastDayOfMonth.getDay();
      if (lastDayWeekday < 6) {
        const daysToAdd = 6 - lastDayWeekday;
        for (let i = 1; i <= daysToAdd + 1; i++) {
          const dayDate = new Date(currentYear, currentMonthIndex + 1, i);
          dates.push({
            day: i,
            label: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][
              dayDate.getDay()
            ],
            status: "Unavailable",
            isCurrentMonth: false,
            date: dayDate,
          });
        }
      }

      const todayIndex = dates.findIndex((date) => date.status === "Today");

      let startingIndex = 0;
      if (todayIndex >= 0) {
        startingIndex = Math.floor(todayIndex / 7) * 7;
      }
      return dates.slice(startingIndex);
    };

    setWeekDates(generateCalendarDates());
  }, [currentMonth]);

  const getDateStatus = (day) => {
    const date = weekDates.find((d) => d.day === day);
    return date ? date.status : "Available";
  };

  const handleDateSelect = (dayDate) => {
    if (
      getDateStatus(dayDate.getDate()) !== "Past" &&
      getDateStatus(dayDate.getDate()) !== "Unavailable"
    ) {
      setSelectedDate(dayDate);
      onDateSelect(dayDate);
      setWeekIndex(currentWeekIndex);
    }
  };

  const getVisibleWeekDates = () => {
    if (!weekDates || !Array.isArray(weekDates) || weekDates.length === 0) {
      return [];
    }

    const weekSize = 7;
    const maxDays = maxWeeks * weekSize;
    const startIndex = currentWeekIndex * weekSize;
    if (startIndex >= maxDays) return [];
    return weekDates.slice(
      startIndex,
      Math.min(startIndex + weekSize, maxDays)
    );
  };

  const handlePreviousWeek = () => {
    if (currentWeekIndex > 0) {
      const newIndex = currentWeekIndex - 1;
      setCurrentWeekIndex(newIndex);
      setWeekIndex(newIndex);
    }
  };
  const maxWeeks = Math.ceil(weekDates.length / 7);

  const handleNextWeek = () => {
    if (currentWeekIndex < maxWeeks - 1) {
      const newIndex = currentWeekIndex + 1;
      setCurrentWeekIndex(newIndex);
      setWeekIndex(newIndex);
    }
  };

  const getWeekRangeText = () => {
    const visibleDates = getVisibleWeekDates();
    if (!visibleDates || visibleDates.length === 0) return "";

    const firstDay = visibleDates[0].day;
    const lastDay = visibleDates[visibleDates.length - 1].day;

    const firstMonth = visibleDates[0].isCurrentMonth
      ? currentMonth
      : visibleDates[0].day > 20
      ? MONTHS[today.getMonth() - 1] || MONTHS[11]
      : MONTHS[today.getMonth() + 1] || MONTHS[0];
    const lastMonth = visibleDates[visibleDates.length - 1].isCurrentMonth
      ? currentMonth
      : visibleDates[visibleDates.length - 1].day < 10
      ? MONTHS[today.getMonth() + 1] || MONTHS[0]
      : MONTHS[today.getMonth() - 1] || MONTHS[11];

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDay} - ${lastDay}, ${today.getFullYear()}`;
    } else {
      return `${firstMonth} ${firstDay} - ${lastMonth} ${lastDay}, ${today.getFullYear()}`;
    }
  };

  return (
    <Card className="calendar-card">
      <div className="calendar-header">
        <Title className="calendar-title poppins-medium2" level={4}>
          Weekly Calendar
        </Title>
        <Space size="small">
          {currentWeekIndex > 0 && (
            <Button
              type="text"
              icon={<LeftOutlined />}
              size="small"
              onClick={handlePreviousWeek}
            />
          )}
          <Text className="calendar-range-text poppins-medium">
            {getWeekRangeText()}
          </Text>
          {currentWeekIndex < maxWeeks - 1 && (
            <Button
              type="text"
              icon={<RightOutlined />}
              size="small"
              onClick={handleNextWeek}
            />
          )}
        </Space>
      </div>

      <div className="calendar-grid">
        {getVisibleWeekDates().map((date, index) => (
          <div key={`date-container-${index}`}>
            <div className="calendar-date-label inter-500">{date.label}</div>
            <div
              key={`${date.day}-${index}`}
              onClick={() => handleDateSelect(date.date)}
              className="calendar-date"
              style={{
                cursor:
                  date.status !== "Past"
                    ? date.status !== "Unavailable"
                      ? "pointer"
                      : "not-allowed"
                    : "not-allowed",
                backgroundColor:
                  date.status === "Today"
                    ? "#306BDD"
                    : date.status === "Available"
                    ? "transparent"
                    : "#F3F4F6",
                color:
                  date.status === "Today"
                    ? "#FFFFFF"
                    : date.status === "Available" &&
                      date.day !== selectedDate.getDate()
                    ? "#000000"
                    : date.day === selectedDate.getDate()
                    ? "#1E42B1"
                    : "#9CA3AF",
                border:
                  date.status === "Today" && date.day !== selectedDate.getDate()
                    ? "none"
                    : date.status === "Available" &&
                      date.day !== selectedDate.getDate()
                    ? "1px solid #E5E7EB"
                    : date.day === selectedDate.getDate()
                    ? "2px solid #1E42B1"
                    : "1px solid #9CA3AF",
                opacity: !date.isCurrentMonth
                  ? 0.6
                  : date.status === "Past"
                  ? 0.6
                  : 1,
              }}
            >
              <div className="calendar-date-number inter-600">{date.day}</div>
              <div className="calendar-date-status inter-400">
                {date.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CalendarSlotContainer;
