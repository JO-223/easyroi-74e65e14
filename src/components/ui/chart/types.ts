
import * as React from "react";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

// Re-export the THEMES constant from utils so it can be used by both types.ts and other components
import { THEMES } from "./utils";
export { THEMES };

export type ChartContextProps = {
  config: ChartConfig;
};
