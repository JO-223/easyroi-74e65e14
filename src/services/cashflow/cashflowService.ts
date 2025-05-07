
import { supabase } from "@/integrations/supabase/client";

export interface CashflowEntry {
  month: string;
  monthIndex: number;
  year: number;
  totalBookings: number;
  portalCommissions: number;
  cleaningCosts: number;
  touristTaxDTCM: number;
  grossTotal: number;
  utilityCosts: number;
  maintenanceCosts: number;
  netTotal: number;
  isActual: boolean; // true for actual data, false for forecast
}

/**
 * Fetches cashflow data for a specific time period
 */
export const fetchCashflowData = async (
  startDate?: Date,
  endDate?: Date,
  propertyId?: string
): Promise<CashflowEntry[]> => {
  try {
    // In a production environment, this would fetch from a real table
    // For now, we'll generate mock data
    const mockData: CashflowEntry[] = generateMockCashflowData();
    
    // Apply filters if provided
    let filteredData = [...mockData];
    
    if (startDate) {
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      filteredData = filteredData.filter(entry => 
        (entry.year > startYear) || 
        (entry.year === startYear && entry.monthIndex >= startMonth)
      );
    }
    
    if (endDate) {
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;
      filteredData = filteredData.filter(entry => 
        (entry.year < endYear) || 
        (entry.year === endYear && entry.monthIndex <= endMonth)
      );
    }

    if (propertyId) {
      // In a real implementation, we would filter by property ID
      // For mock data, we'll just return as is
    }
    
    return filteredData;
  } catch (error) {
    console.error("Error fetching cashflow data:", error);
    return [];
  }
};

/**
 * Generates mock cashflow data for demonstration
 */
const generateMockCashflowData = (): CashflowEntry[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const data: CashflowEntry[] = [];
  
  // Generate data for the current year and the next year (24 months total)
  for (let year = currentYear; year <= currentYear + 1; year++) {
    for (let month = 1; month <= 12; month++) {
      // Skip past months for next year
      if (year === currentYear + 1 && month > currentMonth) {
        continue;
      }
      
      // For months that have passed or current month in current year, use "actual" data
      // For future months, use "forecast" data
      const isActual = (year < currentYear) || 
                      (year === currentYear && month <= currentMonth + 1);
      
      // Create some variation in the data
      const multiplier = isActual ? 1 : 0.9 + Math.random() * 0.2; // Slight randomization for forecasts
      const baseBookings = 10 + Math.floor(Math.random() * 8);
      const totalBookings = Math.floor(baseBookings * multiplier);
      
      // Calculate derived values
      const portalCommissions = Math.round(totalBookings * 120 * 0.15); // 15% commission on average booking of €120
      const cleaningCosts = totalBookings * 25; // €25 per cleaning
      const touristTaxDTCM = totalBookings * 3.5; // €3.5 per booking
      
      const grossTotal = (totalBookings * 120) - portalCommissions - cleaningCosts - touristTaxDTCM;
      
      const utilityCosts = 80 + Math.floor(Math.random() * 40); // €80-120 for utilities
      const maintenanceCosts = isActual ? 
        Math.floor(Math.random() * 200) : // Random actual maintenance costs
        50; // Forecast maintenance costs
        
      const netTotal = grossTotal - utilityCosts - maintenanceCosts;
      
      // Get month name
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      
      data.push({
        month: monthNames[month - 1],
        monthIndex: month,
        year,
        totalBookings,
        portalCommissions,
        cleaningCosts,
        touristTaxDTCM,
        grossTotal,
        utilityCosts,
        maintenanceCosts,
        netTotal,
        isActual
      });
    }
  }
  
  // Sort by year and month
  return data.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthIndex - b.monthIndex;
  });
};

/**
 * Export cashflow data to CSV format
 */
export const exportCashflowToCSV = (data: CashflowEntry[]): string => {
  if (!data || data.length === 0) return '';
  
  // Create CSV header
  const headers = [
    'Month',
    'Year',
    'Total Bookings',
    'Portal Commissions',
    'Cleaning Costs',
    'Tourist Tax DTCM',
    'Gross Total',
    'Utility Costs',
    'Maintenance Costs',
    'Net Total',
    'Data Type'
  ];
  
  // Create CSV rows
  const rows = data.map(entry => [
    entry.month,
    entry.year.toString(),
    entry.totalBookings.toString(),
    entry.portalCommissions.toFixed(2),
    entry.cleaningCosts.toFixed(2),
    entry.touristTaxDTCM.toFixed(2),
    entry.grossTotal.toFixed(2),
    entry.utilityCosts.toFixed(2),
    entry.maintenanceCosts.toFixed(2),
    entry.netTotal.toFixed(2),
    entry.isActual ? 'Actual' : 'Forecast'
  ]);
  
  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Format currency value for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};
