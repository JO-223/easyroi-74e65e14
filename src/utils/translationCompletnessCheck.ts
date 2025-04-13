
import en from "@/locales/en";
import it from "@/locales/it";
import es from "@/locales/es";
import de from "@/locales/de";

// Check what percentage of English keys are translated in other languages
export function checkTranslationCompleteness() {
  const englishKeys = getAllKeysFromObject(en);
  
  const italianKeys = getAllKeysFromObject(it);
  const spanishKeys = getAllKeysFromObject(es);
  const germanKeys = getAllKeysFromObject(de);
  
  const italianMissing = findMissingKeys(englishKeys, italianKeys);
  const spanishMissing = findMissingKeys(englishKeys, spanishKeys);
  const germanMissing = findMissingKeys(englishKeys, germanKeys);
  
  const italianPercentage = calculatePercentage(englishKeys.length, italianMissing.length);
  const spanishPercentage = calculatePercentage(englishKeys.length, spanishMissing.length);
  const germanPercentage = calculatePercentage(englishKeys.length, germanMissing.length);
  
  console.log(`
    Translation Completeness:
    Italian: ${italianPercentage}% (${italianMissing.length} keys missing)
    Spanish: ${spanishPercentage}% (${spanishMissing.length} keys missing)
    German: ${germanPercentage}% (${germanMissing.length} keys missing)
  `);
  
  if (italianMissing.length > 0) {
    console.log("Missing Italian translations:", italianMissing.slice(0, 10), italianMissing.length > 10 ? `... and ${italianMissing.length - 10} more` : "");
  }
  
  if (spanishMissing.length > 0) {
    console.log("Missing Spanish translations:", spanishMissing.slice(0, 10), spanishMissing.length > 10 ? `... and ${spanishMissing.length - 10} more` : "");
  }
  
  if (germanMissing.length > 0) {
    console.log("Missing German translations:", germanMissing.slice(0, 10), germanMissing.length > 10 ? `... and ${germanMissing.length - 10} more` : "");
  }
}

// Helper function to get all keys from an object, including nested ones
function getAllKeysFromObject(obj: any, prefix = ''): string[] {
  return Object.entries(obj).reduce((acc: string[], [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return [...acc, ...getAllKeysFromObject(value, newKey)];
    }
    
    return [...acc, newKey];
  }, []);
}

// Helper function to find keys that are in the first array but not in the second
function findMissingKeys(baseKeys: string[], compareKeys: string[]): string[] {
  return baseKeys.filter(key => !compareKeys.includes(key));
}

// Helper function to calculate percentage
function calculatePercentage(total: number, missing: number): number {
  if (total === 0) return 100;
  return Math.round(((total - missing) / total) * 100);
}

// Run the check
checkTranslationCompleteness();
