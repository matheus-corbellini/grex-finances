"use client";

import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  labelPosition?: "left" | "right";
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  id?: string;
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Switch: React.FC<SwitchProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label = "Airplane mode",
  labelPosition = "right",
  variant = "default",
  showLabel = true,
  id,
  name,
  className = "",
  style,
}) => {
  const theme = useTheme();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  // Use controlled or uncontrolled state
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;

    const newValue = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  // Container styles
  const getContainerStyles = (): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: theme.getSpacing("m"),
    fontFamily: theme.getFontFamily("primary"),
    cursor: disabled ? "not-allowed" : "pointer",
  });

  // Switch track styles
  const getTrackStyles = (): React.CSSProperties => {
    const baseStyles = {
      position: "relative" as const,
      borderRadius: theme.getRadius("round"),
      transition: "all 0.2s ease-in-out",
      cursor: disabled ? "not-allowed" : "pointer",
      border: "none",
      outline: "none",
    };

    // Size-specific dimensions
    let trackWidth, trackHeight, thumbSize;
    switch (size) {
      case "sm":
        trackWidth = "32px";
        trackHeight = "16px";
        thumbSize = "12px";
        break;
      case "lg":
        trackWidth = "48px";
        trackHeight = "24px";
        thumbSize = "20px";
        break;
      default: // md
        trackWidth = "40px";
        trackHeight = "20px";
        thumbSize = "16px";
        break;
    }

    // Variant-specific colors
    let backgroundColor;
    switch (variant) {
      case "success":
        backgroundColor = isChecked
          ? theme.colors.success[600]
          : theme.colors.neutrals[200];
        break;
      case "warning":
        backgroundColor = isChecked
          ? theme.colors.warning[600]
          : theme.colors.neutrals[200];
        break;
      case "error":
        backgroundColor = isChecked
          ? theme.colors.error[600]
          : theme.colors.neutrals[200];
        break;
      default:
        backgroundColor = isChecked
          ? theme.colors.primary[600]
          : theme.colors.neutrals[200];
        break;
    }

    return {
      ...baseStyles,
      width: trackWidth,
      height: trackHeight,
      backgroundColor: disabled ? theme.colors.neutrals[100] : backgroundColor,
      opacity: disabled ? 0.6 : 1,
    };
  };

  // Switch thumb styles
  const getThumbStyles = (): React.CSSProperties => {
    const baseStyles = {
      position: "absolute" as const,
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: theme.colors.baseWhite,
      borderRadius: "50%",
      transition: "all 0.2s ease-in-out",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    };

    // Size-specific dimensions
    let thumbSize, leftPosition;
    switch (size) {
      case "sm":
        thumbSize = "12px";
        leftPosition = isChecked ? "calc(100% - 14px)" : "2px";
        break;
      case "lg":
        thumbSize = "20px";
        leftPosition = isChecked ? "calc(100% - 22px)" : "2px";
        break;
      default: // md
        thumbSize = "16px";
        leftPosition = isChecked ? "calc(100% - 18px)" : "2px";
        break;
    }

    return {
      ...baseStyles,
      width: thumbSize,
      height: thumbSize,
      left: leftPosition,
    };
  };

  // Label styles
  const getLabelStyles = (): React.CSSProperties => ({
    fontSize: theme.getFontSize("base"),
    fontWeight: theme.getFontWeight("medium"),
    color: disabled ? theme.colors.neutrals[400] : theme.colors.baseBlack,
    userSelect: "none" as const,
  });

  const containerStyles = {
    ...getContainerStyles(),
    ...style,
  };

  // Generate unique ID if not provided
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      style={containerStyles}
      className={`switch switch--${variant} switch--${size} ${className}`}
      onClick={handleToggle}
    >
      {/* Label on the left */}
      {showLabel && labelPosition === "left" && (
        <label htmlFor={switchId} style={getLabelStyles()}>
          {label}
        </label>
      )}

      {/* Switch component */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          id={switchId}
          name={name || switchId}
          role="switch"
          aria-checked={isChecked}
          aria-label={label}
          style={getTrackStyles()}
          disabled={disabled}
          onClick={handleToggle}
        >
          <div style={getThumbStyles()} />
        </button>
      </div>

      {/* Label on the right */}
      {showLabel && labelPosition === "right" && (
        <label htmlFor={switchId} style={getLabelStyles()}>
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;
