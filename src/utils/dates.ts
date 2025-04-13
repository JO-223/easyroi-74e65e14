
import { format, parseISO } from 'date-fns';

/**
 * Format a date string from ISO format to a human-readable date
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDateFromISO(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Format a date string from ISO format to a short date
 * @param dateString ISO date string
 * @returns Formatted short date string
 */
export function formatShortDateFromISO(dateString: string): string {
  try {
    return format(parseISO(dateString), 'PP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}
