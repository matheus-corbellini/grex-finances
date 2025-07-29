import React from "react";
import { useTheme } from "../../context/ThemeContext";

export interface NavigationMenuItemProps {
  children: React.ReactNode;
  variant?: "default" | "active" | "selected";
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  className?: string;
}

export const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  children,
  variant = "default",
  hasSubmenu = false,
  isExpanded = false,
  onClick,
  className = "",
}) => {
  const theme = useTheme();

  // Base styles using design system
  const baseStyles: React.CSSProperties = {
    fontFamily: theme.getFontFamily("primary"),
    fontSize: theme.getFontSize("base"),
    fontWeight: theme.getFontWeight("secondary"),
    lineHeight: theme.getLineHeight("normal"),
    letterSpacing: theme.getLetterSpacing("normal"),
    color: theme.colors.baseBlack,
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    gap: theme.getSpacing("xs"),
    textDecoration: "none",
    border: "none",
    background: "transparent",
    outline: "none",
  };

  // Variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "active":
      case "selected":
        return {
          ...baseStyles,
          backgroundColor: theme.colors.neutrals[100],
          borderRadius: theme.getRadius("round"),
          padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
        };
      default:
        return baseStyles;
    }
  };

  // Chevron icon component
  const ChevronIcon = () => {
    if (!hasSubmenu) return null;

    const chevronStyle: React.CSSProperties = {
      width: "12px",
      height: "12px",
      color: theme.colors.baseBlack,
      transition: "transform 0.2s ease-in-out",
      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
    };

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={chevronStyle}
      >
        <polyline points="6,9 12,15 18,9" />
      </svg>
    );
  };

  const styles = getVariantStyles();

  return (
    <button
      type="button"
      onClick={onClick}
      style={styles}
      className={`navigation-menu-item navigation-menu-item--${variant} ${className}`}
    >
      <span>{children}</span>
      <ChevronIcon />
    </button>
  );
};

export default NavigationMenuItem;
