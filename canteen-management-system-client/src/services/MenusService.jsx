import { httpService } from "./HttpService";
import { API_ENDPOINTS } from "../api/API_ENDPOINTS";

export class MenusService {
  async getMenus(offset = 0) {
    try {
      const data = await httpService.privateGet(API_ENDPOINTS.MENUS.LIST, {
        params: { week_offset: offset },
      });
      console.log("Fetched menus data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching menus:", error);
      throw error;
    }
  }

  async getMenusByDate(selectedDate) {
    try {
      const weekOffset = this.calculateWeekOffset(selectedDate);
      
      const data = await this.getMenus(weekOffset);
      
      const filteredMenus = this.filterMenusByDate(data, selectedDate);
      
      console.log("Filtered menus for date:", filteredMenus);
      return filteredMenus;
    } catch (error) {
      console.error("Error fetching date menus:", error);
      throw error;
    }
  }

  async getMenusByTimeSlot(selectedDate, selectedTimeSlot) {
    try {
      const weekOffset = this.calculateWeekOffset(selectedDate);
      
      const data = await this.getMenus(weekOffset);
      
      const filteredMenus = this.filterMenusByDateAndTime(
        data,
        selectedDate,
        selectedTimeSlot
      );
      
      console.log("Filtered menus for time slot:", filteredMenus);
      return filteredMenus;
    } catch (error) {
      console.error("Error fetching time slot menus:", error);
      throw error;
    }
  }

  calculateWeekOffset(selectedDate) {
    const currentDate = new Date();
    const currentWeekStart = this.getWeekStart(currentDate);
    const selectedWeekStart = this.getWeekStart(selectedDate);
    
    const timeDiff = selectedWeekStart.getTime() - currentWeekStart.getTime();
    const weekDiff = Math.round(timeDiff / (7 * 24 * 60 * 60 * 1000));
    
    console.log("Week offset calculation:");
    console.log("Current date:", currentDate);
    console.log("Current week start:", currentWeekStart);
    console.log("Selected date:", selectedDate);
    console.log("Selected week start:", selectedWeekStart);
    console.log("Week offset calculated:", weekDiff);
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
      console.log("No menu data or selected date:", { menuData: menuData?.results?.length, selectedDate });
      return { ...menuData, results: [] };
    }

    console.log("Raw menu data received:", menuData);
    console.log("Total menus in response:", menuData.results.length);

    const selectedDateStr = this.formatDateToString(selectedDate);
    console.log("Filtering for date only:", selectedDateStr);

    menuData.results.forEach(menu => {
      const startTime = new Date(menu.start_time);
      const menuDateStr = this.formatDateToString(startTime);
      console.log(`Menu "${menu.name}": ${menu.start_time} -> ${menuDateStr}`);
    });

    const filteredResults = menuData.results.filter((menu) => {
      const startTime = new Date(menu.start_time);
      const menuDateStr = this.formatDateToString(startTime);
      const isCorrectDate = menuDateStr === selectedDateStr;
      
      console.log(`Menu ${menu.name}: Date ${menuDateStr}, Selected: ${selectedDateStr}, Match: ${isCorrectDate}`);
      
      return isCorrectDate;
    });

    console.log(`Filtered ${filteredResults.length} menus out of ${menuData.results.length} total menus`);

    const transformedResults = this.transformMenuData(filteredResults);

    return {
      ...menuData,
      results: transformedResults
    };
  }

  filterMenusByDateAndTime(menuData, selectedDate, selectedTimeSlot) {
    if (!menuData?.results || !selectedDate || !selectedTimeSlot) {
      console.log("Missing required data:", { 
        menuResults: menuData?.results?.length, 
        selectedDate, 
        selectedTimeSlot 
      });
      return { ...menuData, results: [] };
    }

    console.log("Raw menu data for time filtering:", menuData);
    console.log("Total menus in response:", menuData.results.length);

    const selectedDateStr = this.formatDateToString(selectedDate);
    
    const selectedTimeValue = typeof selectedTimeSlot === 'string' 
      ? selectedTimeSlot 
      : selectedTimeSlot.timeValue || selectedTimeSlot;

    console.log("Filtering for date:", selectedDateStr, "time:", selectedTimeValue);

    menuData.results.forEach(menu => {
      const startTime = new Date(menu.start_time);
      const endTime = new Date(menu.end_time);
      const menuDateStr = this.formatDateToString(startTime);
      console.log(`Menu "${menu.name}": ${menu.start_time} -> ${menuDateStr}, Time: ${startTime.getHours()}:${startTime.getMinutes().toString().padStart(2, '0')} - ${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}`);
    });

    const filteredResults = menuData.results.filter((menu) => {
      const startTime = new Date(menu.start_time);
      const endTime = new Date(menu.end_time);
      
      const menuDateStr = this.formatDateToString(startTime);
      const isCorrectDate = menuDateStr === selectedDateStr;
      
      if (!isCorrectDate) {
        console.log(`Menu ${menu.name}: Wrong date - ${menuDateStr} vs ${selectedDateStr}`);
        return false;
      }

      const selectedTimeInMinutes = this.timeStringToMinutes(selectedTimeValue);
      const startTimeInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
      const endTimeInMinutes = endTime.getHours() * 60 + endTime.getMinutes();
      
      const isWithinTimeRange = 
        selectedTimeInMinutes >= startTimeInMinutes && 
        selectedTimeInMinutes < endTimeInMinutes;

      console.log(`Menu ${menu.name}: Date match: ${isCorrectDate}, Time range: ${startTimeInMinutes}-${endTimeInMinutes}, Selected: ${selectedTimeInMinutes}, Within range: ${isWithinTimeRange}`);
      
      return isWithinTimeRange;
    });

    console.log(`Filtered ${filteredResults.length} menus out of ${menuData.results.length} total menus for time slot`);

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
            name: menuItem.item_name,
            description: menuItem.item_description,
            base_price: menuItem.item_base_price,
            quantity: menuItem.quantity,
            remaining_quantity: menuItem.remaining_quantity
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
    console.log(`Date formatting: ${date} -> ${formatted}`);
    return formatted;
  }

  timeStringToMinutes(timeString) {
    const cleanTimeString = timeString.trim();
    const [hours, minutes] = cleanTimeString.split(':').map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid time format:", timeString);
      return 0;
    }
    
    const totalMinutes = hours * 60 + minutes;
    console.log(`Time conversion: ${timeString} -> ${totalMinutes} minutes`);
    return totalMinutes;
  }
}

export const menusService = new MenusService();