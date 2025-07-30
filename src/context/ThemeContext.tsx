"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  colors,
  spacing,
  radius,
  breakpoints,
  grid,
  typography,
  getSpacing,
  getRadius,
  getBreakpoint,
  getGridValue,
  getFontFamily,
  getFontWeight,
  getFontSize,
  getLineHeight,
  getLetterSpacing,
} from "../styles/tokens";

// Theme interface
interface Theme {
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  breakpoints: typeof breakpoints;
  grid: typeof grid;
  typography: typeof typography;
  getSpacing: typeof getSpacing;
  getRadius: typeof getRadius;
  getBreakpoint: typeof getBreakpoint;
  getGridValue: typeof getGridValue;
  getFontFamily: typeof getFontFamily;
  getFontWeight: typeof getFontWeight;
  getFontSize: typeof getFontSize;
  getLineHeight: typeof getLineHeight;
  getLetterSpacing: typeof getLetterSpacing;
}

// Create context
const ThemeContext = createContext<Theme | undefined>(undefined);

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme: Theme = {
    colors,
    spacing,
    radius,
    breakpoints,
    grid,
    typography,
    getSpacing,
    getRadius,
    getBreakpoint,
    getGridValue,
    getFontFamily,
    getFontWeight,
    getFontSize,
    getLineHeight,
    getLetterSpacing,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

// Hook to use theme
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
