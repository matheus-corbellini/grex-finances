"use client";

import React from "react";
import { useTheme } from "../../context/ThemeContext";

export interface ProgressBarProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  value?: number;
  max?: number;
  showLabel?: boolean;
  labelPosition?: "top" | "bottom" | "inside";
  labelFormat?: "percentage" | "fraction" | "custom";
  customLabel?: string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  variant = "default",
  size = "md",
  value = 0,
  max = 100,
  showLabel = false,
  labelPosition = "top",
  labelFormat = "percentage",
  customLabel,
  animated = false,
  striped = false,
  indeterminate = false,
  className = "",
  style,
}) => {
  const theme = useTheme();

  // Calculate progress percentage
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Base container styles using design system
  const getContainerStyles = (): React.CSSProperties => ({
    width: "100%",
    fontFamily: theme.getFontFamily("primary"),
    position: "relative" as const,
  });

  // Track (background) styles
  const getTrackStyles = (): React.CSSProperties => {
    const baseStyles = {
      width: "100%",
      backgroundColor: theme.colors.neutrals[200],
      borderRadius: theme.getRadius("round"),
      overflow: "hidden" as const,
      position: "relative" as const,
    };

    switch (size) {
      case "sm":
        return { ...baseStyles, height: "8px" };
      case "lg":
        return { ...baseStyles, height: "16px" };
      default: // md
        return { ...baseStyles, height: "12px" };
    }
  };

  // Progress bar (fill) styles
  const getProgressStyles = (): React.CSSProperties => {
    const baseStyles = {
      height: "100%",
      borderRadius: theme.getRadius("round"),
      transition: animated ? "width 0.3s ease-in-out" : "none",
      position: "relative" as const,
      overflow: "hidden" as const,
    };

    // Variant-specific colors
    let backgroundColor;
    switch (variant) {
      case "success":
        backgroundColor = theme.colors.success[600];
        break;
      case "warning":
        backgroundColor = theme.colors.warning[600];
        break;
      case "error":
        backgroundColor = theme.colors.error[600];
        break;
      case "info":
        backgroundColor = theme.colors.primary[600];
        break;
      default:
        backgroundColor = theme.colors.primary[600];
    }

    const progressStyles = {
      ...baseStyles,
      backgroundColor,
      width: indeterminate ? "100%" : `${percentage}%`,
    };

    // Add striped animation if enabled
    if (striped) {
      return {
        ...progressStyles,
        backgroundImage: `linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.15) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.15) 75%,
          transparent 75%,
          transparent
        )`,
        backgroundSize: "1rem 1rem",
        animation: animated
          ? "progress-bar-stripes 1s linear infinite"
          : "none",
      };
    }

    return progressStyles;
  };

  // Label styles
  const getLabelStyles = (): React.CSSProperties => ({
    fontSize: theme.getFontSize("sm"),
    fontWeight: theme.getFontWeight("medium"),
    color: theme.colors.baseBlack,
    marginBottom: labelPosition === "top" ? theme.getSpacing("xs") : 0,
    marginTop: labelPosition === "bottom" ? theme.getSpacing("xs") : 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  });

  // Inside label styles
  const getInsideLabelStyles = (): React.CSSProperties => ({
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: theme.getFontSize("xs"),
    fontWeight: theme.getFontWeight("bold"),
    color: theme.colors.baseWhite,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  });

  // Generate label text
  const getLabelText = (): string => {
    if (customLabel) return customLabel;

    switch (labelFormat) {
      case "percentage":
        return `${Math.round(percentage)}%`;
      case "fraction":
        return `${value}/${max}`;
      default:
        return `${Math.round(percentage)}%`;
    }
  };

  // Indeterminate animation styles
  const getIndeterminateStyles = (): React.CSSProperties => ({
    position: "absolute" as const,
    top: 0,
    left: 0,
    height: "100%",
    width: "30%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: theme.getRadius("round"),
    animation: "progress-bar-indeterminate 1.5s ease-in-out infinite",
  });

  const containerStyles = {
    ...getContainerStyles(),
    ...style,
  };

  return (
    <div
      style={containerStyles}
      className={`progress-bar progress-bar--${variant} progress-bar--${size} ${className}`}
    >
      {/* Top label */}
      {showLabel && labelPosition === "top" && (
        <div style={getLabelStyles()}>
          <span>Progress</span>
          <span>{getLabelText()}</span>
        </div>
      )}

      {/* Progress bar container */}
      <div style={getTrackStyles()}>
        {/* Progress fill */}
        <div style={getProgressStyles()}>
          {/* Indeterminate overlay */}
          {indeterminate && <div style={getIndeterminateStyles()} />}

          {/* Inside label */}
          {showLabel && labelPosition === "inside" && percentage > 15 && (
            <div style={getInsideLabelStyles()}>{getLabelText()}</div>
          )}
        </div>
      </div>

      {/* Bottom label */}
      {showLabel && labelPosition === "bottom" && (
        <div style={getLabelStyles()}>
          <span>Progress</span>
          <span>{getLabelText()}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
