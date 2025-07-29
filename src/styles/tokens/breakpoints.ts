export const breakpoints = {
  mobile: "320px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1440px",
} as const;

export const breakpointValues = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export type BreakpointKey = keyof typeof breakpoints;
export type BreakpointValue = (typeof breakpoints)[BreakpointKey];

// Media query helpers
export const mediaQueries = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`,
} as const;

// Helper function to get breakpoint value
export const getBreakpoint = (key: BreakpointKey): BreakpointValue =>
  breakpoints[key];

// Helper function to get breakpoint value in pixels
export const getBreakpointPx = (key: BreakpointKey): number =>
  breakpointValues[key];
