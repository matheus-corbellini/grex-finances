import React from "react";
import { Toast } from "./Toast";
import { ToastContainer } from "./ToastContainer";

// Simple demonstration of Toast component
export const ToastDemo = () => {
  const [toasts, setToasts] = React.useState<any[]>([]);

  const addToast = (toastProps: any) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toastProps, id }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
              variant: "default",
              title: "Scheduled: Catch up",
              description: "Friday, February 10, 2023 at 5:57 PM",
              actionText: "Undo",
              onClose: () => removeToast(Date.now()),
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
              onClose: () => removeToast(Date.now()),
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
              onClose: () => removeToast(Date.now()),
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
              isVisible={true}
              message={toast.title}
              type={toast.variant}
              onClose={toast.onClose}
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
      isVisible={true}
      message="Scheduled: Catch up"
      type="success"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const SuccessToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      isVisible={true}
      message="Scheduled: Catch up"
      type="success"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const ErrorToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      isVisible={true}
      message="Uh oh! Something went wrong."
      type="error"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const WarningToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      isVisible={true}
      message="Warning: Low battery"
      type="warning"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const InfoToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      isVisible={true}
      message="Information"
      type="info"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export const ToastWithoutAction = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      isVisible={true}
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
      isVisible={true}
      message="Primary Action"
      type="success"
      onClose={() => console.log("Toast closed")}
    />

    <Toast
      isVisible={true}
      message="Secondary Action"
      type="info"
      onClose={() => console.log("Toast closed")}
    />

    <Toast
      isVisible={true}
      message="Subtle Action"
      type="warning"
      onClose={() => console.log("Toast closed")}
    />

    <Toast
      isVisible={true}
      message="Outline Action"
      type="error"
      onClose={() => console.log("Toast closed")}
    />
  </div>
);

export default ToastDemo;
