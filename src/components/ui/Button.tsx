"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";

export interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "subtle"
    | "destructive"
    | "ghost"
    | "link";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
  style,
}) => {
  const theme = useTheme();

  // Base styles using design system
  const getBaseStyles = (): React.CSSProperties => ({
    fontFamily: theme.getFontFamily("primary"),
    fontWeight: theme.getFontWeight("medium"),
    lineHeight: theme.getLineHeight("normal"),
    letterSpacing: theme.getLetterSpacing("normal"),
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.getSpacing("xs"),
    textDecoration: "none",
    border: "none",
    outline: "none",
    borderRadius: theme.getRadius("m"),
    width: fullWidth ? "100%" : "auto",
    position: "relative",
    overflow: "hidden",
  });

  // Size-specific styles
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "sm":
        return {
          fontSize: theme.getFontSize("sm"),
          padding: `${theme.getSpacing("xs")} ${theme.getSpacing("s")}`,
          minHeight: "32px",
        };
      case "lg":
        return {
          fontSize: theme.getFontSize("lg"),
          padding: `${theme.getSpacing("m")} ${theme.getSpacing("l")}`,
          minHeight: "48px",
        };
      default: // md
        return {
          fontSize: theme.getFontSize("base"),
          padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
          minHeight: "40px",
        };
    }
  };

  // Variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    const baseStyles = getBaseStyles();
    const sizeStyles = getSizeStyles();

    switch (variant) {
      case "primary":
        return {
          ...baseStyles,
          ...sizeStyles,
          backgroundColor: disabled
            ? theme.colors.neutrals[300]
            : theme.colors.primary[600],
          color: theme.colors.baseWhite,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        };

      case "secondary":
        return {
          ...baseStyles,
          ...sizeStyles,
          backgroundColor: theme.colors.baseWhite,
          color: theme.colors.baseBlack,
          border: `1px solid ${theme.colors.neutrals[200]}`,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        };

      case "subtle":
        return {
          ...baseStyles,
          ...sizeStyles,
          backgroundColor: disabled
            ? theme.colors.neutrals[300]
            : theme.colors.secondary[600],
          color: theme.colors.baseBlack,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        };

      case "destructive":
        return {
          ...baseStyles,
          ...sizeStyles,
          backgroundColor: disabled
            ? theme.colors.neutrals[300]
            : theme.colors.error[200],
          color: theme.colors.baseWhite,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        };

      case "ghost":
        return {
          ...baseStyles,
          ...sizeStyles,
          backgroundColor: "transparent",
          color: theme.colors.baseBlack,
        };

      case "link":
        return {
          ...baseStyles,
          ...sizeStyles,
          backgroundColor: "transparent",
          color: theme.colors.primary[600],
          textDecoration: "underline",
          padding: 0,
          minHeight: "auto",
        };

      default:
        return baseStyles;
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      style={{
        width: "16px",
        height: "16px",
        animation: "spin 1s linear infinite",
      }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );

  // Add icon component (for circular add button)
  const AddIcon = () => (
    <svg
      style={{ width: "16px", height: "16px" }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  const styles = getVariantStyles();

  // Handle circular add button variant
  if (variant === "ghost" && children === "Add") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        style={{
          ...styles,
          borderRadius: theme.getRadius("round"),
          width: size === "lg" ? "48px" : size === "sm" ? "32px" : "40px",
          height: size === "lg" ? "48px" : size === "sm" ? "32px" : "40px",
          padding: 0,
          minHeight: "auto",
          ...style,
        }}
        className={`button button--${variant} button--${size} ${className}`}
      >
        <AddIcon />
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...styles, ...style }}
      className={`button button--${variant} button--${size} ${className}`}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && icon}
      {!loading && <span>{children}</span>}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
