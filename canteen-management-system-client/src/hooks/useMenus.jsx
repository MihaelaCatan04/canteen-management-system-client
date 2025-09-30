import { useState, useEffect } from "react";
import { menusService } from "../services/MenusService";

export const useMenus = (selectedDate, selectedTimeSlot) => {
  const [menuItems, setMenuItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMenus = async (date, timeSlot) => {
    if (!date) {
      setMenuItems(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      if (!timeSlot) {
        data = await menusService.getMenusByDate(date);
      } else {
        data = await menusService.getMenusByTimeSlot(date, timeSlot);
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
      console.error("=== ERROR FETCHING MENUS ===");
      console.error("Error details:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      setError(err.message);
      setMenuItems(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus(selectedDate, selectedTimeSlot);
  }, [selectedDate, selectedTimeSlot]);

  return {
    menuItems,
    loading,
    error,
    refetch: () => {
      return fetchMenus(selectedDate, selectedTimeSlot);
    }
  };
};