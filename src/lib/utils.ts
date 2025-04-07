
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined, currency = 'EUR') {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}
