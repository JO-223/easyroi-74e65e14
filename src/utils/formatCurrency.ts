
/**
 * Utility per formattare valori monetari in modo coerente in tutta l'applicazione
 */

/**
 * Formatta un valore monetario secondo lo stile preferito dell'utente
 * 
 * @param value - Il valore da formattare
 * @param currency - La valuta (default: AED)
 * @param compactDisplay - Se usare formato compatto per numeri grandi (es. 3.45M)
 * @returns - Stringa formattata (es. "AED3,450,000" o "AED3.45M")
 */
export function formatCurrency(
  value: number,
  currency: string = 'AED',
  compactDisplay: boolean = false
): string {
  if (value === undefined || value === null) {
    return '';
  }

  // Gestione valori negativi o zero
  if (value === 0) return `AED0`;
  
  // Formattazione compatta per valori grandi (es. 3.45M)
  if (compactDisplay && Math.abs(value) >= 1000000) {
    return `AED${(value / 1000000).toFixed(2)}M`;
  }
  
  // Formattazione standard con separatore delle migliaia
  const formatter = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  // Replace the currency symbol with AED
  return formatter.format(value).replace(/[^\d,.-]/g, '') + ' AED';
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
