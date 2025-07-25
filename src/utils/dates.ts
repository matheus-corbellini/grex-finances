/**
 * Utilitários para manipulação de datas em contextos financeiros
 */

export const formatDate = (
  date: Date | string,
  locale: string = "pt-BR"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale);
};

export const formatDateTime = (
  date: Date | string,
  locale: string = "pt-BR"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleString(locale);
};

export const formatRelativeDate = (
  date: Date | string,
  locale: string = "pt-BR"
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Hoje";
  if (diffInDays === 1) return "Ontem";
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} meses atrás`;

  return `${Math.floor(diffInDays / 365)} anos atrás`;
};

export const getStartOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

export const getStartOfYear = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), 0, 1);
};

export const getEndOfYear = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
};

export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDateRange = (
  period: string
): { startDate: Date; endDate: Date } => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  switch (period) {
    case "today":
      return { startDate: startOfToday, endDate: endOfToday };

    case "yesterday":
      const yesterday = addDays(startOfToday, -1);
      return {
        startDate: yesterday,
        endDate: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1),
      };

    case "thisWeek":
      const startOfWeek = new Date(startOfToday);
      startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
      return { startDate: startOfWeek, endDate: endOfToday };

    case "lastWeek":
      const lastWeekStart = addDays(startOfToday, -startOfToday.getDay() - 7);
      const lastWeekEnd = addDays(lastWeekStart, 6);
      lastWeekEnd.setHours(23, 59, 59, 999);
      return { startDate: lastWeekStart, endDate: lastWeekEnd };

    case "thisMonth":
      return { startDate: getStartOfMonth(now), endDate: endOfToday };

    case "lastMonth":
      const lastMonth = addMonths(now, -1);
      return {
        startDate: getStartOfMonth(lastMonth),
        endDate: getEndOfMonth(lastMonth),
      };

    case "thisYear":
      return { startDate: getStartOfYear(now), endDate: endOfToday };

    case "lastYear":
      const lastYear = new Date(now.getFullYear() - 1, 0, 1);
      return {
        startDate: getStartOfYear(lastYear),
        endDate: getEndOfYear(lastYear),
      };

    case "last30Days":
      return { startDate: addDays(startOfToday, -30), endDate: endOfToday };

    case "last90Days":
      return { startDate: addDays(startOfToday, -90), endDate: endOfToday };

    case "last365Days":
      return { startDate: addDays(startOfToday, -365), endDate: endOfToday };

    default:
      return { startDate: getStartOfMonth(now), endDate: endOfToday };
  }
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = domingo, 6 = sábado
};

export const getBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

export const getMonthName = (
  monthIndex: number,
  locale: string = "pt-BR"
): string => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleDateString(locale, { month: "long" });
};

export const getQuarter = (date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

export const getQuarterDates = (
  year: number,
  quarter: number
): { startDate: Date; endDate: Date } => {
  const startMonth = (quarter - 1) * 3;
  const startDate = new Date(year, startMonth, 1);
  const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);

  return { startDate, endDate };
};
