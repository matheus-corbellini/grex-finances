export const colors = {
  // Base Colors
  baseWhite: "#fafafa",
  baseBlack: "#222222",
  Primary: "#28b3f9",
  Secondary: "#00ed97",
  Success: "#69f3b2",
  Warning: "#f4c790",
  Error: "#e4626f",

  // Primary Palette (Blues)
  primary: {
    100: "#ddf1fc",
    200: "#b7e6fd",
    300: "#93d9fc",
    400: "#70ccfb",
    500: "#4cc0fa",
    600: "#07a5f5",
    700: "#068cd0",
    800: "#0574ab",
    900: "#045b87",
    1000: "#034262",
  },

  // Secondary Palette (Greens/Teals)
  secondary: {
    100: "#d8fff1",
    200: "#b1ffe3",
    300: "#8affd5",
    400: "#63FFC6",
    500: "#3CFFB8",
    600: "#15FFAA",
    700: "#00ca81",
    800: "#00a76a",
    900: "#008354",
    1000: "#00603d",
  },

  // Neutrals Palette (Grays)
  neutrals: {
    100: "#e7e7e7",
    200: "#d5d5d5",
    300: "#c2c2c2",
    400: "#b0b0b0",
    500: "#9d9d9d",
    600: "#8b8b8b",
    700: "#787878",
    800: "#666666",
    900: "#535353",
    1000: "#414141",
  },

  // Success Palette (Greens)
  success: {
    100: "#B4FFC9",
    200: "#1EED80",
    300: "#0E9D52",
  },

  // Warning Palette (Oranges)
  warning: {
    100: "#F4C790",
    200: "#EDA145",
    300: "#CC7914",
  },

  // Error Palette (Reds)
  error: {
    100: "#E4626F",
    200: "#C03744",
    300: "#8C1823",
  },
} as const;

export type ColorPalette = typeof colors;
export type ColorKey = keyof ColorPalette;
export type ColorShade = keyof ColorPalette["primary"];
