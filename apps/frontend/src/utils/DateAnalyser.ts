export function lotNeedsMowing(dateToCheck?: Date): number {
  if (!dateToCheck) {
    // if date does not exist, it needs mowing
    return 1;
  }

  // Normalize dateToCheck to remove time components
  const date = new Date(dateToCheck);
  date.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get the start and end of the current week
  const { start: currentWeekStart, end: currentWeekEnd } = getWeekRange(today, 0);

  // Get the start and end of the previous week
  const { start: previousWeekStart, end: previousWeekEnd } = getWeekRange(today, -1);

  if (date >= currentWeekStart && date <= currentWeekEnd) {
    // Date is in the current week
    return 0;
  } else if (date >= previousWeekStart && date <= previousWeekEnd) {
    // Date is in the previous week
    return 1;
  } else {
    // Date is older than the previous week
    return 2;
  }
}

// Helper function to get the start and end dates of a week
function getWeekRange(referenceDate: Date, weekOffset: number = 0): { start: Date; end: Date } {
  // Create a copy of the reference date
  const date = new Date(referenceDate);

  // Adjust the date to the desired week
  date.setDate(date.getDate() + weekOffset * 7);

  // Find the Monday of the week
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Adjust when day is Sunday (0)
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);

  // Find the Sunday of the week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  return { start: weekStart, end: weekEnd };
}
