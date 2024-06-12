export const getMinutesBetweenDates = (startDate: Date, endDate: Date) => {
  const diff = endDate.getTime() - startDate.getTime();

  return Math.floor(diff / 60000);
};

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getMonthName = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "short" }).format(date);

export const getWeekName = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
  });
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `Week ${weekNumber} ${formatter.format(date)}`;
};

export const getDayName = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
