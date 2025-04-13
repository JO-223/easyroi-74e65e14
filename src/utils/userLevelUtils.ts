
import { UserLevel } from "@/components/ui/user-badge";

export const USER_LEVEL_THRESHOLDS = {
  starter: 0,
  bronze: 300000,
  silver: 750000,
  gold: 1500000,
  ruby: 3000000,
  emerald: 6000000,
  platinum: 10000000,
  diamond: 20000000,
};

export type InvestorLevelKey = keyof typeof USER_LEVEL_THRESHOLDS;

/**
 * Determina il livello dell'utente in base all'investimento totale
 */
export function determineUserLevel(totalInvestment: number): UserLevel {
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.diamond) return 'diamond';
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.platinum) return 'platinum';
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.emerald) return 'emerald';
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.ruby) return 'ruby';
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.gold) return 'gold';
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.silver) return 'silver';
  if (totalInvestment >= USER_LEVEL_THRESHOLDS.bronze) return 'bronze';
  return 'starter';
}

/**
 * Ottiene il livello successivo
 */
export function getNextLevel(currentLevel: UserLevel): UserLevel | null {
  const levels: UserLevel[] = ['starter', 'bronze', 'silver', 'gold', 'ruby', 'emerald', 'platinum', 'diamond'];
  const currentIndex = levels.indexOf(currentLevel);
  
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  
  return null;
}

/**
 * Calcola la percentuale di progresso verso il livello successivo
 */
export function calculateLevelProgress(totalInvestment: number, currentLevel: UserLevel): number {
  const nextLevel = getNextLevel(currentLevel);
  if (!nextLevel) return 100;
  
  const currentThreshold = USER_LEVEL_THRESHOLDS[currentLevel as InvestorLevelKey];
  const nextThreshold = USER_LEVEL_THRESHOLDS[nextLevel as InvestorLevelKey];
  const range = nextThreshold - currentThreshold;
  const progress = ((totalInvestment - currentThreshold) / range) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Calcola quanto manca per raggiungere il livello successivo
 */
export function calculateAmountToNextLevel(totalInvestment: number, currentLevel: UserLevel): number {
  const nextLevel = getNextLevel(currentLevel);
  if (!nextLevel) return 0;
  
  const nextThreshold = USER_LEVEL_THRESHOLDS[nextLevel as InvestorLevelKey];
  return Math.max(0, nextThreshold - totalInvestment);
}

/**
 * Formatta il livello dell'utente per la visualizzazione
 */
export function formatUserLevel(level: UserLevel, t?: (key: string) => string): string {
  if (!t) return level;
  return t(level);
}
