
import { UserLevel } from "@/types/user";

// Define level thresholds (in euros)
const LEVEL_THRESHOLDS = {
  starter: 0,
  bronze: 300000,
  silver: 750000,
  gold: 1500000,
  ruby: 3000000,
  emerald: 6000000,
  platinum: 10000000,
  diamond: 20000000
};

/**
 * Calculates appropriate user level based on total investment amount
 * 
 * @param totalInvestment Total investment amount in euros
 * @returns The appropriate user level
 */
export function calculateUserLevel(totalInvestment: number): UserLevel {
  if (totalInvestment >= LEVEL_THRESHOLDS.diamond) return 'diamond';
  if (totalInvestment >= LEVEL_THRESHOLDS.platinum) return 'platinum';
  if (totalInvestment >= LEVEL_THRESHOLDS.emerald) return 'emerald';
  if (totalInvestment >= LEVEL_THRESHOLDS.ruby) return 'ruby';
  if (totalInvestment >= LEVEL_THRESHOLDS.gold) return 'gold';
  if (totalInvestment >= LEVEL_THRESHOLDS.silver) return 'silver';
  if (totalInvestment >= LEVEL_THRESHOLDS.bronze) return 'bronze';
  return 'starter';
}
