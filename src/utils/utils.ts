export const getMinutesBetweenDates = (startDate: Date, endDate: Date) => {
  const diff = endDate.getTime() - startDate.getTime();

  return Math.floor(diff / 60000);
};

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
