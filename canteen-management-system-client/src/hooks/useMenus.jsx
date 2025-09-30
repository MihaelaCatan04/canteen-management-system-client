import { useState, useEffect } from "react";
import { menusService } from "../services/MenusService";

export const useMenus = (selectedDate, selectedTimeSlot, weekIndex) => {
  const [menuItems, setMenuItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenus = async (date, timeSlot, weekIndex) => {
    if (!date) {
      setMenuItems(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let rawData;
      rawData = await menusService.getMenus(weekIndex);
      let data;
      if (!timeSlot) {
        data = await menusService.getMenusByDate(date, rawData);
      } else {
        data = await menusService.getMenusByTimeSlot(date, timeSlot, rawData);
      }
      
      // if (data?.results) {
      //   data.results.forEach((menu, index) => {
      //     console.log(`Menu ${index + 1}:`, {
      //       id: menu.id,
      //       name: menu.name,
      //       start_time: menu.start_time,
      //       end_time: menu.end_time,
      //       type: menu.type
      //     });
      //   });
      // }
      
      setMenuItems(data);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message);
      setMenuItems(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus(selectedDate, selectedTimeSlot, weekIndex);
  }, [weekIndex]);

  return {
    menuItems,
    loading,
    error,
    refetch: () => {
      return fetchMenus(selectedDate, selectedTimeSlot);
    }
  };
};