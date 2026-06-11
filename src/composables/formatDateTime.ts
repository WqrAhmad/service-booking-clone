// @/composables/formatDate.ts

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';

  const d = new Date(date);

  if (isNaN(d.getTime())) return '-';

  const datePart = d.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const hours = d.getHours();
  const period = hours < 12 ? 'AM' : 'PM';

  // Show AM/PM like a small badge next to the date
  return `${datePart} [${period}]`;
};