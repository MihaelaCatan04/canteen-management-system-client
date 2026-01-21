import { useState, useEffect } from "react";
import { menusService } from "../services/MenusService";

export const useMenus = (selectedDate, selectedTimeSlot, weekIndex) => {
  const [menuItems, setMenuItems] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      if (weekIndex === null || weekIndex === undefined) {
        setRawData(null);
        setMenuItems(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await menusService.getMenus(weekIndex);
        setRawData(data);
      } catch (err) {
        setError(err.message);
        setRawData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [weekIndex]);

  useEffect(() => {
    const filterAndSetMenus = async () => {


      if (!rawData) {
        setMenuItems(null);
        return;
      }

      if (!selectedDate) {
        setMenuItems(null);
        return;
      }

      try {
        let filteredData;

        if (!selectedTimeSlot) {
          filteredData = await menusService.getMenusByDate(selectedDate, rawData);
        } else {
          filteredData = await menusService.getMenusByTimeSlot(
            selectedDate,
            selectedTimeSlot,
            rawData
          );
        }

        setMenuItems(filteredData);
      } catch (err) {
        setError(err.message);
        setMenuItems(null);
      }
    };

    filterAndSetMenus();
  }, [rawData, selectedDate, selectedTimeSlot]);

  const refetch = async () => {
    if (weekIndex === null || weekIndex === undefined) return;

    try {
      setLoading(true);
      setError(null);

      const data = await menusService.getMenus(weekIndex);
      setRawData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    menuItems,
    loading,
    error,
    refetch,
  };
};
