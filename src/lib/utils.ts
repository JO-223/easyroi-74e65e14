
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency = 'AED') {
  if (amount === null || amount === undefined) return '';
  
  const formatter = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  });
  
  // Replace the currency symbol with AED
  return formatter.format(amount).replace(/[^\d,.-]/g, '') + ' AED';
}
