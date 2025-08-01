"use client";

import React, { useState, useCallback, useId } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Toast, ToastProps } from "./Toast";

export interface ToastContainerProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  maxToasts?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface ToastItem extends Omit<ToastProps, "position"> {
  id: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
  maxToasts = 5,
  className = "",
  style,
}) => {
  const theme = useTheme();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const uniqueId = useId();

  // Add toast function
  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${uniqueId}`;
      const newToast: ToastItem = { ...toast, id };

      setToasts((prev) => {
        const updated = [newToast, ...prev];
        return updated.slice(0, maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  // Remove toast function
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Container styles based on position
  const getContainerStyles = (): React.CSSProperties => {
    const baseStyles = {
      position: "fixed" as const,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column" as const,
      gap: theme.getSpacing("s"),
      padding: theme.getSpacing("m"),
      pointerEvents: "none" as const,
    };

    switch (position) {
      case "top-right":
        return {
          ...baseStyles,
          top: 0,
          right: 0,
        };
      case "top-left":
        return {
          ...baseStyles,
          top: 0,
          left: 0,
        };
      case "bottom-right":
        return {
          ...baseStyles,
          bottom: 0,
          right: 0,
        };
      case "bottom-left":
        return {
          ...baseStyles,
          bottom: 0,
          left: 0,
        };
      case "top-center":
        return {
          ...baseStyles,
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom-center":
        return {
          ...baseStyles,
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        };
      default:
        return baseStyles;
    }
  };

  const containerStyles = {
    ...getContainerStyles(),
    ...style,
  };

  return (
    <div
      style={containerStyles}
      className={`toast-container toast-container--${position} ${className}`}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: "auto" }}>
          <Toast
            {...toast}
            position={position}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Export the addToast function for global use
export const toast = {
  success: (title: string, description?: string, actionText?: string) => {
    // This would be implemented with a global toast manager
    console.log("Toast success:", { title, description, actionText });
  },
  error: (title: string, description?: string, actionText?: string) => {
    console.log("Toast error:", { title, description, actionText });
  },
  warning: (title: string, description?: string, actionText?: string) => {
    console.log("Toast warning:", { title, description, actionText });
  },
  info: (title: string, description?: string, actionText?: string) => {
    console.log("Toast info:", { title, description, actionText });
  },
  default: (title: string, description?: string, actionText?: string) => {
    console.log("Toast default:", { title, description, actionText });
  },
};

export default ToastContainer;
