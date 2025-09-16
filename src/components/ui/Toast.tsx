"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader2
} from "lucide-react";
import styles from "./Toast.module.css";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info" | "loading";
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = "info",
  duration = 5000,
  onClose,
  action,
  position = "top-right"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0 && type !== "loading") {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, type]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match CSS transition duration
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "warning":
        return <AlertTriangle size={20} />;
      case "loading":
        return <Loader2 size={20} className="animate-spin" />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "var(--color-success-50)",
          borderColor: "var(--color-success-200)",
          iconColor: "var(--color-success-600)",
          titleColor: "var(--color-success-900)",
          messageColor: "var(--color-success-700)"
        };
      case "error":
        return {
          backgroundColor: "var(--color-error-50)",
          borderColor: "var(--color-error-200)",
          iconColor: "var(--color-error-600)",
          titleColor: "var(--color-error-900)",
          messageColor: "var(--color-error-700)"
        };
      case "warning":
        return {
          backgroundColor: "var(--color-warning-50)",
          borderColor: "var(--color-warning-200)",
          iconColor: "var(--color-warning-600)",
          titleColor: "var(--color-warning-900)",
          messageColor: "var(--color-warning-700)"
        };
      case "loading":
        return {
          backgroundColor: "var(--color-primary-50)",
          borderColor: "var(--color-primary-200)",
          iconColor: "var(--color-primary-600)",
          titleColor: "var(--color-primary-900)",
          messageColor: "var(--color-primary-700)"
        };
      default:
        return {
          backgroundColor: "var(--color-neutrals-50)",
          borderColor: "var(--color-neutrals-200)",
          iconColor: "var(--color-neutrals-600)",
          titleColor: "var(--color-neutrals-900)",
          messageColor: "var(--color-neutrals-700)"
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      className={`${styles.toast} ${styles[position]} ${isVisible ? styles.visible : ""} ${isExiting ? styles.exiting : ""}`}
      style={{
        backgroundColor: typeStyles.backgroundColor,
        borderColor: typeStyles.borderColor,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className={styles.toastContent}>
        <div className={styles.toastIcon} style={{ color: typeStyles.iconColor }}>
          {getIcon()}
        </div>

        <div className={styles.toastBody}>
          {title && (
            <div className={styles.toastTitle} style={{ color: typeStyles.titleColor }}>
              {title}
            </div>
          )}
          <div className={styles.toastMessage} style={{ color: typeStyles.messageColor }}>
            {message}
          </div>

          {action && (
            <button
              className={styles.toastAction}
              onClick={action.onClick}
              style={{ color: typeStyles.iconColor }}
            >
              {action.label}
            </button>
          )}
        </div>

        {type !== "loading" && (
          <button
            className={styles.toastClose}
            onClick={handleClose}
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {duration > 0 && type !== "loading" && (
        <div className={styles.toastProgress}>
          <div
            className={styles.toastProgressBar}
            style={{
              animationDuration: `${duration}ms`,
              backgroundColor: typeStyles.iconColor
            }}
          />
        </div>
      )}
    </div>
  );
};