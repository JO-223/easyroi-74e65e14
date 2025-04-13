
/**
 * Utility functions for formatting various data types
 */

/**
 * Format a number as currency with the given currency symbol
 * @param amount The amount to format
 * @param currency The currency symbol (default: "€")
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | undefined, currency: string = "€"): string => {
  if (amount === undefined || amount === null) return `${currency}0`;
  
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format a percentage with the % symbol
 * @param value The percentage value
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | undefined, decimals: number = 1): string => {
  if (value === undefined || value === null) return "0%";
  
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
};

/**
 * Format a date to a human-readable string
 * @param dateString Date string to format
 * @param format Format type ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | undefined, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'medium':
    default:
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  }
};
