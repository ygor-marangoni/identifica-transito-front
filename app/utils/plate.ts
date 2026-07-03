const OLD_FORMAT_REGEX = /^[A-Z]{3}[0-9]{4}$/;
const MERCOSUL_FORMAT_REGEX = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

export const normalizePlate = (value: string) => {
  return (value || '').toUpperCase().replace(/[-\s]/g, '');
};

export const isValidPlate = (value: string) => {
  const normalized = normalizePlate(value);
  return OLD_FORMAT_REGEX.test(normalized) || MERCOSUL_FORMAT_REGEX.test(normalized);
};
