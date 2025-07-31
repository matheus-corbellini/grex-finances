"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";

export interface PaginationLinkProps {
  variant?: "link" | "button";
  direction?: "previous" | "next";
  text?: string;
  disabled?: boolean;
  active?: boolean;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PaginationLink: React.FC<PaginationLinkProps> = ({
  variant = "link",
  direction = "next",
  text,
  disabled = false,
  active = false,
  size = "md",
  showIcon = true,
  iconPosition,
  onClick,
  href,
  className = "",
  style,
}) => {
  const theme = useTheme();

  // Determine default text based on direction
  const getDefaultText = (): string => {
    if (text) return text;
    return direction === "previous" ? "Previous" : "Next";
  };

  // Determine icon position based on direction if not specified
  const getIconPosition = (): "left" | "right" => {
    if (iconPosition) return iconPosition;
    return direction === "previous" ? "left" : "right";
  };

  // Base styles using design system
  const getBaseStyles = (): React.CSSProperties => ({
    fontFamily: theme.getFontFamily("primary"),
    fontSize: theme.getFontSize("base"),
    fontWeight: theme.getFontWeight("medium"),
    color: disabled ? theme.colors.neutrals[400] : theme.colors.baseBlack,
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    display: "inline-flex",
    alignItems: "center",
    gap: theme.getSpacing("xs"),
    border: "none",
    background: "none",
    padding: 0,
    outline: "none",
  });

  // Variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    if (variant === "button") {
      return {
        backgroundColor: disabled
          ? theme.colors.neutrals[100]
          : theme.colors.neutrals[200],
        color: disabled ? theme.colors.neutrals[400] : theme.colors.baseBlack,
        padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
        borderRadius: theme.getRadius("m"),
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease-in-out",
      };
    }

    // Link variant (ghost style)
    return {
      backgroundColor: "transparent",
      color: disabled ? theme.colors.neutrals[400] : theme.colors.baseBlack,
      textDecoration: "none",
      cursor: disabled ? "not-allowed" : "pointer",
    };
  };

  // Size-specific styles
  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "sm":
        return {
          fontSize: theme.getFontSize("sm"),
          padding:
            variant === "button"
              ? `${theme.getSpacing("xs")} ${theme.getSpacing("s")}`
              : 0,
        };
      case "lg":
        return {
          fontSize: theme.getFontSize("lg"),
          padding:
            variant === "button"
              ? `${theme.getSpacing("m")} ${theme.getSpacing("l")}`
              : 0,
        };
      default: // md
        return {
          fontSize: theme.getFontSize("base"),
          padding:
            variant === "button"
              ? `${theme.getSpacing("s")} ${theme.getSpacing("m")}`
              : 0,
        };
    }
  };

  // Active state styles
  const getActiveStyles = (): React.CSSProperties => {
    if (active) {
      return {
        backgroundColor: theme.colors.primary[100],
        color: theme.colors.primary[600],
        fontWeight: theme.getFontWeight("bold"),
      };
    }
    return {};
  };

  // Icon component
  const ChevronIcon = () => {
    const iconColor = disabled
      ? theme.colors.neutrals[400]
      : theme.colors.baseBlack;
    const iconSize = size === "sm" ? "14" : size === "lg" ? "18" : "16";

    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ flexShrink: 0 }}
      >
        {direction === "previous" ? (
          <polyline points="15,18 9,12 15,6" />
        ) : (
          <polyline points="9,18 15,12 9,6" />
        )}
      </svg>
    );
  };

  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.();
  };

  const linkStyles = {
    ...getBaseStyles(),
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...getActiveStyles(),
    ...style,
  };

  const displayText = getDefaultText();
  const iconPos = getIconPosition();

  // Render as link if href is provided
  if (href && !disabled) {
    return (
      <a
        href={href}
        style={linkStyles}
        className={`pagination-link pagination-link--${variant} pagination-link--${direction} pagination-link--${size} ${className}`}
        onClick={handleClick}
      >
        {showIcon && iconPos === "left" && <ChevronIcon />}
        <span>{displayText}</span>
        {showIcon && iconPos === "right" && <ChevronIcon />}
      </a>
    );
  }

  // Render as button
  return (
    <button
      type="button"
      style={linkStyles}
      className={`pagination-link pagination-link--${variant} pagination-link--${direction} pagination-link--${size} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {showIcon && iconPos === "left" && <ChevronIcon />}
      <span>{displayText}</span>
      {showIcon && iconPos === "right" && <ChevronIcon />}
    </button>
  );
};

export default PaginationLink;
