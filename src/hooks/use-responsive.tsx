
import * as React from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpointValues[breakpoint]);
    };

    // Check immediately
    checkBreakpoint();

    // Add resize listener
    window.addEventListener("resize", checkBreakpoint);

    // Cleanup
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

export function useResponsive() {
  const [windowSize, setWindowSize] = React.useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  // Function to check if a screen size matches
  const isXs = useBreakpoint("xs");
  const isSm = useBreakpoint("sm");
  const isMd = useBreakpoint("md");
  const isLg = useBreakpoint("lg");
  const isXl = useBreakpoint("xl");
  const is2Xl = useBreakpoint("2xl");

  // Create a simplified descriptor for current screen size
  const screenSize = React.useMemo((): Breakpoint => {
    if (is2Xl) return "2xl";
    if (isXl) return "xl";
    if (isLg) return "lg";
    if (isMd) return "md";
    if (isSm) return "sm";
    return "xs";
  }, [is2Xl, isXl, isLg, isMd, isSm]);

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    windowSize,
    screenSize,
    isMobile: screenSize === "xs" || screenSize === "sm",
    isTablet: screenSize === "md" || screenSize === "lg",
    isDesktop: screenSize === "xl" || screenSize === "2xl",
    isLargeScreen: screenSize === "2xl",
  };
}
