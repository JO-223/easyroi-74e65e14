
/**
 * Formats a number as currency with the given locale and currency code
 * @param value The number to format
 * @param locale The locale to use for formatting
 * @param currencyCode The currency code to use
 * @returns Formatted currency string
 */
export const formatCurrency = (value?: number, locale = 'it-IT', currencyCode = 'EUR') => {
  if (value === undefined || value === null) {
    return '—';
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a number as a percentage with the given locale
 * @param value The number to format
 * @param locale The locale to use for formatting
 * @param digits The number of digits after the decimal point
 * @returns Formatted percentage string
 */
export const formatPercentage = (value?: number, locale = 'it-IT', digits = 1) => {
  if (value === undefined || value === null) {
    return '—';
  }

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
};

/**
 * Formats a date according to the given locale and options
 * @param date The date to format
 * @param locale The locale to use for formatting
 * @param options The options for the date formatting
 * @returns Formatted date string
 */
export const formatDate = (
  date?: string | Date,
  locale = 'it-IT',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
) => {
  if (!date) {
    return '—';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};
