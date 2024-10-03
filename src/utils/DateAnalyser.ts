export function isDateWithinThisWeek(dateToCheck: Date): boolean {
  const today = new Date();

  // Get the current day of the week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = today.getDay();

  // Calculate the difference between today and Monday (1)
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

  // Get the date of the most recent Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  // Get the date of the upcoming Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // Sunday is 6 days after Monday

  // Compare if dateToCheck is within the current week's Monday-Sunday range
  return dateToCheck >= monday && dateToCheck <= sunday;
}

// Example usage:
const exampleDate = new Date('2024-10-04'); // Set the date you want to check
const isWithinWeek = isDateWithinThisWeek(exampleDate);

console.log(isWithinWeek); // Outputs true or false based on the comparison
