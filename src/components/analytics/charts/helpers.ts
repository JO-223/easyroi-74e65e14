
/**
 * Generate default ROI performance data when no actual data exists
 */
export function generateDefaultRoiPerformance() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    roi: 0,
    benchmark: 3.2
  }));
}
