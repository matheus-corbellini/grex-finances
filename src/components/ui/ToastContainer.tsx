"use client";

import React from "react";
import { Toast, ToastProps } from "./Toast";
import styles from "./ToastContainer.module.css";

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
  position?: ToastProps["position"];
  maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
  position = "top-right",
  maxToasts = 5
}) => {
  const visibleToasts = toasts.slice(0, maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {visibleToasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => onRemoveToast(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};