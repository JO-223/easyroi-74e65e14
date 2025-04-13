
import en from "@/locales/en";
import it from "@/locales/it";
import es from "@/locales/es";
import de from "@/locales/de";

/**
 * Utility function to check translation completeness across all languages
 */
export function checkTranslationCompleteness() {
  const englishKeys = getAllKeysFromObject(en);
  const italianKeys = getAllKeysFromObject(it);
  const spanishKeys = getAllKeysFromObject(es);
  const germanKeys = getAllKeysFromObject(de);
  
  const italianMissing = findMissingKeys(englishKeys, italianKeys);
  const spanishMissing = findMissingKeys(englishKeys, spanishKeys);
  const germanMissing = findMissingKeys(englishKeys, germanKeys);
  
  const italianPercentage = calculateCompleteness(englishKeys.length, italianMissing.length);
  const spanishPercentage = calculateCompleteness(englishKeys.length, spanishMissing.length);
  const germanPercentage = calculateCompleteness(englishKeys.length, germanMissing.length);
  
  return {
    totalKeys: englishKeys.length,
    italian: {
      completenessPercentage: italianPercentage,
      missingCount: italianMissing.length,
      missingKeys: italianMissing
    },
    spanish: {
      completenessPercentage: spanishPercentage,
      missingCount: spanishMissing.length,
      missingKeys: spanishMissing
    },
    german: {
      completenessPercentage: germanPercentage,
      missingCount: germanMissing.length,
      missingKeys: germanMissing
    }
  };
}

// Get all keys from an object, including nested ones
function getAllKeysFromObject(obj: any, prefix = ""): string[] {
  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return [...acc, ...getAllKeysFromObject(value, newKey)];
    }
    
    return [...acc, newKey];
  }, []);
}

// Find keys that exist in first array but not in second
function findMissingKeys(baseKeys: string[], compareKeys: string[]): string[] {
  return baseKeys.filter(key => !compareKeys.includes(key));
}

// Calculate completeness percentage
function calculateCompleteness(total: number, missing: number): number {
  return Math.round(((total - missing) / total) * 100);
}
