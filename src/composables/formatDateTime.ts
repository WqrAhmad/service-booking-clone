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

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${datePart} ${hours}:${minutes}`;
};