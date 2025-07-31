"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export interface ToastProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  actionText?: string;
  actionVariant?: "primary" | "secondary" | "subtle" | "outline";
  onAction?: () => void;
  onClose?: () => void;
  duration?: number;
  autoClose?: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  className?: string;
  style?: React.CSSProperties;
}

export const Toast: React.FC<ToastProps> = ({
  variant = "default",
  title,
  description,
  actionText,
  actionVariant = "primary",
  onAction,
  onClose,
  duration = 5000,
  autoClose = true,
  position = "top-right",
  className = "",
  style,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  // Auto-close functionality
  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose?.();
        }, 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  // Base toast styles using design system
  const getBaseToastStyles = (): React.CSSProperties => ({
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: theme.getSpacing("m"),
    borderRadius: theme.getRadius("lg"),
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    minWidth: "320px",
    maxWidth: "400px",
    fontFamily: theme.getFontFamily("primary"),
    transition: "all 0.3s ease-in-out",
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(-10px)",
    position: "relative",
    zIndex: 1000,
  });

  // Variant-specific styles
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: theme.colors.success[100],
          border: `1px solid ${theme.colors.success[200]}`,
        };
      case "error":
        return {
          backgroundColor: theme.colors.error[100],
          border: `1px solid ${theme.colors.error[200]}`,
        };
      case "warning":
        return {
          backgroundColor: theme.colors.warning[100],
          border: `1px solid ${theme.colors.warning[200]}`,
        };
      case "info":
        return {
          backgroundColor: theme.colors.primary[100],
          border: `1px solid ${theme.colors.primary[200]}`,
        };
      default:
        return {
          backgroundColor: theme.colors.baseWhite,
          border: `1px solid ${theme.colors.neutrals[200]}`,
        };
    }
  };

  // Title styles
  const getTitleStyles = (): React.CSSProperties => ({
    fontSize: theme.getFontSize("base"),
    fontWeight: theme.getFontWeight("bold"),
    color:
      variant === "error" ? theme.colors.error[800] : theme.colors.baseBlack,
    marginBottom: description ? theme.getSpacing("xs") : 0,
    lineHeight: theme.getLineHeight("tight"),
  });

  // Description styles
  const getDescriptionStyles = (): React.CSSProperties => ({
    fontSize: theme.getFontSize("sm"),
    fontWeight: theme.getFontWeight("secondary"),
    color:
      variant === "error"
        ? theme.colors.error[700]
        : theme.colors.neutrals[600],
    lineHeight: theme.getLineHeight("normal"),
  });

  // Action button styles
  const getActionButtonStyles = (): React.CSSProperties => {
    const baseStyles = {
      fontFamily: theme.getFontFamily("primary"),
      fontSize: theme.getFontSize("sm"),
      fontWeight: theme.getFontWeight("medium"),
      padding: `${theme.getSpacing("xs")} ${theme.getSpacing("m")}`,
      borderRadius: theme.getRadius("m"),
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      marginLeft: theme.getSpacing("m"),
      whiteSpace: "nowrap" as const,
    };

    switch (actionVariant) {
      case "primary":
        return {
          ...baseStyles,
          backgroundColor:
            variant === "error"
              ? theme.colors.error[600]
              : theme.colors.primary[600],
          color: theme.colors.baseWhite,
        };
      case "secondary":
        return {
          ...baseStyles,
          backgroundColor: theme.colors.neutrals[200],
          color: theme.colors.baseBlack,
        };
      case "subtle":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color:
            variant === "error"
              ? theme.colors.error[600]
              : theme.colors.primary[600],
        };
      case "outline":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color:
            variant === "error"
              ? theme.colors.error[600]
              : theme.colors.primary[600],
          border: `1px solid ${
            variant === "error"
              ? theme.colors.error[300]
              : theme.colors.primary[300]
          }`,
        };
      default:
        return baseStyles;
    }
  };

  // Close button styles
  const getCloseButtonStyles = (): React.CSSProperties => ({
    position: "absolute",
    top: theme.getSpacing("s"),
    right: theme.getSpacing("s"),
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: theme.getSpacing("xs"),
    borderRadius: theme.getRadius("s"),
    color:
      variant === "error"
        ? theme.colors.error[600]
        : theme.colors.neutrals[500],
    fontSize: theme.getFontSize("sm"),
    fontWeight: theme.getFontWeight("bold"),
    transition: "all 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "20px",
    height: "20px",
  });

  // Close icon component
  const CloseIcon = () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const handleAction = () => {
    onAction?.();
  };

  const toastStyles = {
    ...getBaseToastStyles(),
    ...getVariantStyles(),
    ...style,
  };

  return (
    <div
      style={toastStyles}
      className={`toast toast--${variant} toast--${position} ${className}`}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        style={getCloseButtonStyles()}
        aria-label="Close toast"
      >
        <CloseIcon />
      </button>

      {/* Content */}
      <div
        style={{ flex: 1, marginRight: actionText ? theme.getSpacing("m") : 0 }}
      >
        <div style={getTitleStyles()}>{title}</div>
        {description && <div style={getDescriptionStyles()}>{description}</div>}
      </div>

      {/* Action button */}
      {actionText && (
        <button
          type="button"
          onClick={handleAction}
          style={getActionButtonStyles()}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Toast;
