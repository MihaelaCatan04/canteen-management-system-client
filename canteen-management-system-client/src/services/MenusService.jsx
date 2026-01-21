import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class MenusService {
  async getMenus(offset = 0) {
    try {
      const data = await httpService.privateGet(API_ENDPOINTS.MENUS.LIST, {
        params: { week_offset: offset },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getMenusByDate(selectedDate, data) {
    try {
      
      const filteredMenus = this.filterMenusByDate(data, selectedDate);
      return filteredMenus;
    } catch (error) {
      throw error;
    }
  }

  async getMenusByTimeSlot(selectedDate, selectedTimeSlot, data) {
    try {
      const filteredMenus = this.filterMenusByDateAndTime(
        data,
        selectedDate,
        selectedTimeSlot
      );
      
      return filteredMenus;
    } catch (error) {
      throw error;
    }
  }

  calculateWeekOffset(selectedDate) {
    const currentDate = new Date();
    const currentWeekStart = this.getWeekStart(currentDate);
    const selectedWeekStart = this.getWeekStart(selectedDate);
    
    const timeDiff = selectedWeekStart.getTime() - currentWeekStart.getTime();
    const weekDiff = Math.round(timeDiff / (7 * 24 * 60 * 60 * 1000));
    return weekDiff;
  }

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0); 
    return weekStart;
  }

  filterMenusByDate(menuData, selectedDate) {
    if (!menuData?.results || !selectedDate) {
      return { ...menuData, results: [] };
    }

    const selectedDateStr = this.formatDateToString(selectedDate);
    const filteredResults = menuData.results.filter((menu) => {
      const startTime = new Date(menu.start_time);
      const menuDateStr = this.formatDateToString(startTime);
      const isCorrectDate = menuDateStr === selectedDateStr;
      
      return isCorrectDate;
    });

    const transformedResults = this.transformMenuData(filteredResults);
    return {
      ...menuData,
      results: transformedResults
    };
  }

  filterMenusByDateAndTime(menuData, selectedDate, selectedTimeSlot) {
    if (!menuData?.results || !selectedDate || !selectedTimeSlot) {
      return { ...menuData, results: [] };
    }

    const selectedDateStr = this.formatDateToString(selectedDate);
    
    const selectedTimeValue = typeof selectedTimeSlot === 'string' 
      ? selectedTimeSlot 
      : selectedTimeSlot.timeValue || selectedTimeSlot;

    menuData.results.forEach(menu => {
      const startTime = new Date(menu.start_time);
      const endTime = new Date(menu.end_time);
      const menuDateStr = this.formatDateToString(startTime);
    });

    const filteredResults = menuData.results.filter((menu) => {
      const startTime = new Date(menu.start_time);
      const endTime = new Date(menu.end_time);
      
      const menuDateStr = this.formatDateToString(startTime);
      const isCorrectDate = menuDateStr === selectedDateStr;
      
      if (!isCorrectDate) {
        return false;
      }

      const selectedTimeInMinutes = this.timeStringToMinutes(selectedTimeValue);
      const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endTimeInMinutes = endTime.getHours() * 60 + endTime.getMinutes();
      
      const isWithinTimeRange = 
        selectedTimeInMinutes >= startTimeInMinutes && 
        selectedTimeInMinutes < endTimeInMinutes;

      
      return isWithinTimeRange;
    });


    const transformedResults = this.transformMenuData(filteredResults);

    return {
      ...menuData,
      results: transformedResults
    };
  }

  transformMenuData(menus) {
    return menus.map(menu => {
      const itemsByCategory = {};

      if (menu.menu_items && menu.menu_items.length > 0) {
        menu.menu_items.forEach(menuItem => {
          const categoryName = menuItem.category || 'Other';
          
          if (!itemsByCategory[categoryName]) {
            itemsByCategory[categoryName] = {
              name: categoryName,
              items: []
            };
          }

          itemsByCategory[categoryName].items.push({
            id: menuItem.id,
            item_name: menuItem.item_name,
            item_description: menuItem.item_description,
            item_base_price: menuItem.item_base_price,
            quantity: menuItem.quantity,
            remaining_quantity: menuItem.remaining_quantity,
            category: categoryName
          });
        });
      }

      const sortedCategories = Object.values(itemsByCategory);

      return {
        ...menu,
        categories: sortedCategories,
        total_items: menu.menu_items?.length || 0
      };
    });
  }

  formatDateToString(date) {
    const d = new Date(date);
    
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    
    const formatted = `${year}-${month}-${day}`;
    return formatted;
  }

  timeStringToMinutes(timeString) {
    const cleanTimeString = timeString.trim();
    const [hours, minutes] = cleanTimeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      return 0;
    }
    
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  }
}

export const menusService = new MenusService();