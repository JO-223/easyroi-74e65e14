
/**
 * Utility per formattare valori monetari in modo coerente in tutta l'applicazione
 */

// Current exchange rate from EUR to AED (as of May 2025)
const EUR_TO_AED_RATE = 4.03; // 1 EUR = 4.03 AED

/**
 * Formatta un valore monetario secondo lo stile preferito dell'utente
 * 
 * @param value - Il valore da formattare (in EUR)
 * @param currency - La valuta (default: AED)
 * @param compactDisplay - Se usare formato compatto per numeri grandi (es. 3.45M)
 * @returns - Stringa formattata (es. "AED 3,450,000" o "AED 3.45M")
 */
export function formatCurrency(
  value: number,
  currency: string = 'AED',
  compactDisplay: boolean = false
): string {
  if (value === undefined || value === null) {
    return '';
  }

  // Convert from EUR to AED
  const aedValue = value * EUR_TO_AED_RATE;
  
  // Gestione valori negativi o zero
  if (aedValue === 0) return `AED 0`;
  
  // Formattazione compatta per valori grandi (es. 3.45M)
  if (compactDisplay && Math.abs(aedValue) >= 1000000) {
    return `AED ${(aedValue / 1000000).toFixed(2)}M`;
  }
  
  // Formattazione standard con separatore delle migliaia
  const formatter = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(aedValue);
}

/**
 * Formatta ROI come percentuale
 * 
 * @param value - Il valore percentuale da formattare (es. 5.7)
 * @returns - Stringa formattata (es. "5.7%")
 */
export function formatROI(value: number): string {
  if (value === undefined || value === null) {
    return '';
  }
  
  return `${value.toFixed(1)}%`;
}
