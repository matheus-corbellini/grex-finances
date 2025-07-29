export const radius = {
  sharp: "0px",
  xxs: "2px",
  xs: "2px",
  s: "4px",
  sm: "6px",
  m: "10px",
  ml: "16px",
  lg: "24px",
  xl: "36px",
  round: "999px",
} as const;

export type RadiusKey = keyof typeof radius;
export type RadiusValue = (typeof radius)[RadiusKey];

// Helper function to get radius value
export const getRadius = (key: RadiusKey): RadiusValue => radius[key];
