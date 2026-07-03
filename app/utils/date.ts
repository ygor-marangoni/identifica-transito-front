export const formatBirthDate = (value: string, format = 'YYYY-MM-DD') => {
  if (!value) return '';

  if (format === 'YYYY-MM-DD' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [day, month, year] = value.split('/');
  if (!day || !month || !year) {
    return value;
  }

  if (format === 'YYYY-MM-DD') {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return value;
};

export const parseDateForInput = (value?: string | null): string => {
  if (!value) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;

  return value;
};
