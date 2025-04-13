
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

console.log('Duplicate keys in English translations:', findDuplicateKeys(en));
console.log('Duplicate keys in Italian translations:', findDuplicateKeys(it));
console.log('Duplicate keys in Spanish translations:', findDuplicateKeys(es));
console.log('Duplicate keys in German translations:', findDuplicateKeys(de));
