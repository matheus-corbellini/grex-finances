export const grid = {
  // Container max-widths
  container: {
    mobile: "100%",
    tablet: "768px",
    desktop: "1024px",
    wide: "1440px",
  },

  // Grid columns per breakpoint
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
    wide: 12,
  },

  // Grid gaps
  gap: {
    mobile: "16px",
    tablet: "24px",
    desktop: "32px",
    wide: "32px",
  },

  // Column gaps
  columnGap: {
    mobile: "16px",
    tablet: "24px",
    desktop: "32px",
    wide: "32px",
  },

  // Row gaps
  rowGap: {
    mobile: "16px",
    tablet: "24px",
    desktop: "32px",
    wide: "32px",
  },
} as const;

export type GridKey = keyof typeof grid;
export type GridBreakpointKey = keyof typeof grid.container;

// Helper function to get grid value
export const getGridValue = (key: GridKey, breakpoint?: GridBreakpointKey) => {
  const gridValue = grid[key];
  if (breakpoint && typeof gridValue === "object") {
    return gridValue[breakpoint];
  }
  return gridValue;
};

// Helper function to get container max-width
export const getContainerWidth = (breakpoint: GridBreakpointKey) =>
  grid.container[breakpoint];

// Helper function to get column count
export const getColumnCount = (breakpoint: GridBreakpointKey) =>
  grid.columns[breakpoint];

// Helper function to get grid gap
export const getGridGap = (breakpoint: GridBreakpointKey) =>
  grid.gap[breakpoint];
