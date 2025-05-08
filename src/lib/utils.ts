
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Current exchange rate from EUR to AED (as of May 2025)
const EUR_TO_AED_RATE = 4.03; // 1 EUR = 4.03 AED

export function formatCurrency(amount: number | null | undefined, currency = 'AED') {
  if (amount === null || amount === undefined) return '';
  
  // Convert from EUR to AED
  const aedAmount = amount * EUR_TO_AED_RATE;
  
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(aedAmount);
}
