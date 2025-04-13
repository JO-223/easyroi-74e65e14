
import en from "@/locales/en";
import it from "@/locales/it";
import es from "@/locales/es";
import de from "@/locales/de";
import { TranslationValue, TranslationRecord } from "@/contexts/LanguageContext";

const findDuplicateKeys = (obj: TranslationRecord) => {
  const duplicates: string[] = [];
  const keySet = new Set<string>();

  const checkDuplicates = (obj: TranslationRecord, prefix = '') => {
    Object.keys(obj).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (keySet.has(fullKey)) {
        duplicates.push(fullKey);
      } else {
        keySet.add(fullKey);
      }

      // Recursively check nested objects
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        checkDuplicates(obj[key] as TranslationRecord, fullKey);
      }
    });
  };

  checkDuplicates(obj);
  return duplicates;
};

// Find and print duplicate keys with their line numbers where possible
const findDuplicatesWithLineNumbers = (obj: any, name: string) => {
  // Convert object to string representation to analyze
  const objString = JSON.stringify(obj, null, 2);
  const lines = objString.split('\n');
  
  // Find all keys at root level
  const keyCount: Record<string, number[]> = {};
  
  lines.forEach((line, index) => {
    const match = line.match(/"([^"]+)":/);
    if (match) {
      const key = match[1];
      if (!keyCount[key]) {
        keyCount[key] = [];
      }
      keyCount[key].push(index + 1); // +1 for 1-based line numbers
    }
  });
  
  // Find duplicates
  const duplicateKeys = Object.entries(keyCount)
    .filter(([_, lines]) => lines.length > 1)
    .map(([key, lines]) => ({ key, lines }));
  
  console.log(`Duplicate keys in ${name} translations with approximate line numbers:`, 
    duplicateKeys.length > 0 ? duplicateKeys : "No duplicates found");
  
  return duplicateKeys;
};

console.log('Duplicate keys in English translations:', findDuplicateKeys(en));
console.log('Duplicate keys in Italian translations:', findDuplicateKeys(it));
console.log('Duplicate keys in Spanish translations:', findDuplicateKeys(es));
console.log('Duplicate keys in German translations:', findDuplicateKeys(de));

// Run more detailed check on English translations
findDuplicatesWithLineNumbers(en, 'English');
