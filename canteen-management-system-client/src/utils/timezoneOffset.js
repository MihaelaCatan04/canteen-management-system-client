export const parseServerDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  date.setHours(date.getHours() - 2);
  return date;
};
