export const spacing = {
  base: "1rem", // 16px
  xxs: "0.25rem", // 4px
  xs: "0.375rem", // 6px
  s: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  m: "1rem", // 16px
  ml: "1.5rem", // 24px
  l: "2rem", // 32px
  xl: "3rem", // 48px
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = (typeof spacing)[SpacingKey];

// Helper function to get spacing value
export const getSpacing = (key: SpacingKey): SpacingValue => spacing[key];

// Helper function to get spacing in pixels
export const getSpacingPx = (key: SpacingKey): number => {
  const value = spacing[key];
  const remValue = parseFloat(value);
  return remValue * 16; // 1rem = 16px
};
