/**
 * Export expenses data to a downloadable CSV file
 */
export function exportMonthToCsv(year, month, monthName, dailyTotals, rawSlotsMap = {}) {
  const headers = [
    'Date',
    'Day of Week',
    'Morning Amount (INR)',
    'Morning Item',
    'Morning Pay Method',
    'Morning Type',
    'Afternoon Amount (INR)',
    'Afternoon Item',
    'Afternoon Pay Method',
    'Afternoon Type',
    'Night Amount (INR)',
    'Night Item',
    'Night Pay Method',
    'Night Type',
    'Daily Total (INR)'
  ];

  const rows = [headers];

  const sortedDays = [...dailyTotals].sort((a, b) => a.day - b.day);

  for (const day of sortedDays) {
    const dateObj = new Date(year, month - 1, day.day);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    const slots = rawSlotsMap[day.date] || {
      morning: { amount: 0, food_item: '', payment_method: '', category: '' },
      afternoon: { amount: 0, food_item: '', payment_method: '', category: '' },
      night: { amount: 0, food_item: '', payment_method: '', category: '' }
    };

    rows.push([
      day.date,
      dayName,
      slots.morning.amount || 0,
      `"${(slots.morning.food_item || '').replace(/"/g, '""')}"`,
      slots.morning.payment_method || '',
      slots.morning.category || '',
      slots.afternoon.amount || 0,
      `"${(slots.afternoon.food_item || '').replace(/"/g, '""')}"`,
      slots.afternoon.payment_method || '',
      slots.afternoon.category || '',
      slots.night.amount || 0,
      `"${(slots.night.food_item || '').replace(/"/g, '""')}"`,
      slots.night.payment_method || '',
      slots.night.category || '',
      day.total || 0
    ]);
  }

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `DailyExpenses_${monthName}_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
