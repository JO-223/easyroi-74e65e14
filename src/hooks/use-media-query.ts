
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Initialize with null to indicate it's not determined yet
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (not in SSR)
    if (typeof window === "undefined") {
      return;
    }
    
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener("change", handler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}
