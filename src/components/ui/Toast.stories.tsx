import React from "react";
import { Toast, ToastProps } from "./Toast";

// Simple demonstration of Toast component
export const ToastDemo = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const mapVariantToType = (variant: string | undefined): ToastProps["type"] => {
    switch (variant) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "loading":
        return "loading";
      default:
        return "info";
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (toastProps: any) => {
    const id = String(Date.now());
    const newToast: ToastProps = {
      id,
      title: toastProps.title,
      message: toastProps.description ?? toastProps.message ?? "",
      type: mapVariantToType(toastProps.variant),
      duration: toastProps.duration,
      action: toastProps.actionText
        ? {
          label: toastProps.actionText,
          onClick: () => console.log("Action clicked"),
        }
        : undefined,
      onClose: () => removeToast(id),
    };
    setToasts((prev) => [...prev, newToast]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Toast Component Demo</h2>

      {/* Toast Controls */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            addToast({
              variant: "info",
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
              actionText: "Undo",
            })
          }
          style={{
            padding: "8px 16px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          Add Default Toast
        </button>

        <button
          onClick={() =>
            addToast({
              variant: "success",
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
              actionText: "Confirmar",
            })
          }
          style={{
            padding: "8px 16px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
          }}
        >
          Add Success Toast
        </button>

        <button
          onClick={() =>
            addToast({
              variant: "error",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
              actionText: "Try again",
            })
          }
          style={{
            padding: "8px 16px",
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
          }}
        >
          Add Error Toast
        </button>
      </div>

      {/* Toast Display Area */}
      <div
        style={{
          position: "relative",
          minHeight: "200px",
          border: "1px dashed #ccc",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>Toast Display Area</h3>
        <p>Click the buttons above to add toasts here</p>

        {toasts.map((toast) => (
          <div key={toast.id} style={{ marginBottom: "10px" }}>
            <Toast
              id={toast.id}
              title={toast.title}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={toast.onClose}
              action={toast.action}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Individual Toast Examples
export const DefaultToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      id="toast-default"
      message="Scheduled: Catch up"
      type="info"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const SuccessToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      id="toast-success"
      message="Scheduled: Catch up"
      type="success"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const ErrorToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      id="toast-error"
      message="Uh oh! Something went wrong."
      type="error"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const WarningToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      id="toast-warning"
      message="Warning: Low battery"
      type="warning"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const InfoToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      id="toast-info"
      message="Information"
      type="info"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const ToastWithoutAction = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      id="toast-no-action"
      message="Simple notification"
      type="info"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const ToastWithDifferentActionVariants = () => (
  <div
    style={{
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}
  >
    <Toast
      id="toast-action-1"
      message="Primary Action"
      type="success"
      onClose={() => console.log("Toast closed")}
    />

    <Toast
      id="toast-action-2"
      message="Secondary Action"
      type="info"
      onClose={() => console.log("Toast closed")}
    />

    <Toast
      id="toast-action-3"
      message="Subtle Action"
      type="warning"
      onClose={() => console.log("Toast closed")}
    />

    <Toast
      id="toast-action-4"
      message="Outline Action"
      type="error"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export default ToastDemo;
