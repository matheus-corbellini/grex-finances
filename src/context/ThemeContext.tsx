import React, { createContext, useContext, ReactNode } from "react";
import {
  colors,
  spacing,
  radius,
  breakpoints,
  grid,
  typography,
  ColorPalette,
  SpacingKey,
  SpacingValue,
  RadiusKey,
  RadiusValue,
  BreakpointKey,
  BreakpointValue,
  GridKey,
  GridBreakpointKey,
  TypographyKey,
  FontFamilyKey,
  FontWeightKey,
  FontSizeKey,
  LineHeightKey,
  LetterSpacingKey,
  DisplayKey,
  HeadingKey,
  HeroKey,
  FeatureKey,
  HighlightKey,
  ContentKey,
  CaptionKey,
  getSpacing,
  getSpacingPx,
  getRadius,
  getBreakpoint,
  getBreakpointPx,
  getGridValue,
  getContainerWidth,
  getColumnCount,
  getGridGap,
  getFontFamily,
  getFontWeight,
  getFontSize,
  getLineHeight,
  getLetterSpacing,
  getDisplayStyle,
  getHeadingStyle,
  getHeroStyle,
  getFeatureStyle,
  getHighlightStyle,
  getContentStyle,
  getCaptionStyle,
} from "../styles/tokens";

interface ThemeContextType {
  colors: ColorPalette;
  spacing: typeof spacing;
  radius: typeof radius;
  breakpoints: typeof breakpoints;
  grid: typeof grid;
  typography: typeof typography;
  isDarkMode: boolean;
  toggleTheme: () => void;
  getSpacing: (key: SpacingKey) => SpacingValue;
  getSpacingPx: (key: SpacingKey) => number;
  getRadius: (key: RadiusKey) => RadiusValue;
  getBreakpoint: (key: BreakpointKey) => BreakpointValue;
  getBreakpointPx: (key: BreakpointKey) => number;
  getGridValue: (key: GridKey, breakpoint?: GridBreakpointKey) => any;
  getContainerWidth: (breakpoint: GridBreakpointKey) => string;
  getColumnCount: (breakpoint: GridBreakpointKey) => number;
  getGridGap: (breakpoint: GridBreakpointKey) => string;
  getFontFamily: (key: FontFamilyKey) => string;
  getFontWeight: (key: FontWeightKey) => number;
  getFontSize: (key: FontSizeKey) => string;
  getLineHeight: (key: LineHeightKey) => number;
  getLetterSpacing: (key: LetterSpacingKey) => string;
  getDisplayStyle: (key: DisplayKey) => any;
  getHeadingStyle: (key: HeadingKey) => any;
  getHeroStyle: (key: HeroKey) => any;
  getFeatureStyle: (key: FeatureKey) => any;
  getHighlightStyle: (key: HighlightKey) => any;
  getContentStyle: (key: ContentKey) => any;
  getCaptionStyle: (key: CaptionKey) => any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const value: ThemeContextType = {
    colors,
    spacing,
    radius,
    breakpoints,
    grid,
    typography,
    isDarkMode,
    toggleTheme,
    getSpacing,
    getSpacingPx,
    getRadius,
    getBreakpoint,
    getBreakpointPx,
    getGridValue,
    getContainerWidth,
    getColumnCount,
    getGridGap,
    getFontFamily,
    getFontWeight,
    getFontSize,
    getLineHeight,
    getLetterSpacing,
    getDisplayStyle,
    getHeadingStyle,
    getHeroStyle,
    getFeatureStyle,
    getHighlightStyle,
    getContentStyle,
    getCaptionStyle,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
