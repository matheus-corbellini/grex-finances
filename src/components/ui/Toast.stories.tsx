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
              variant={toast.variant}
              title={toast.title}
              description={toast.description}
              actionText={toast.actionText}
              onAction={() => console.log("Action clicked")}
              onClose={toast.onClose}
              autoClose={false}
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
      title="Scheduled: Catch up"
      description="Friday, February 10, 2023 at 5:57 PM"
      actionText="Undo"
      onAction={() => console.log("Undo clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />
  </div>
);

export const SuccessToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      variant="success"
      title="Scheduled: Catch up"
      description="Friday, February 10, 2023 at 5:57 PM"
      actionText="Confirmar"
      onAction={() => console.log("Confirm clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />
  </div>
);

export const ErrorToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      variant="error"
      title="Uh oh! Something went wrong."
      description="There was a problem with your request."
      actionText="Try again"
      onAction={() => console.log("Try again clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />
  </div>
);

export const WarningToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      variant="warning"
      title="Warning: Low battery"
      description="Your device battery is running low."
      actionText="Dismiss"
      onAction={() => console.log("Dismiss clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />
  </div>
);

export const InfoToast = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      variant="info"
      title="Information"
      description="This is an informational message."
      actionText="Learn more"
      onAction={() => console.log("Learn more clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />
  </div>
);

export const ToastWithoutAction = () => (
  <div style={{ padding: "20px" }}>
    <Toast
      title="Simple notification"
      description="This toast has no action button."
      onClose={() => console.log("Toast closed")}
      autoClose={false}
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
      title="Primary Action"
      description="This toast has a primary action button."
      actionText="Primary"
      actionVariant="primary"
      onAction={() => console.log("Primary clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />

    <Toast
      title="Secondary Action"
      description="This toast has a secondary action button."
      actionText="Secondary"
      actionVariant="secondary"
      onAction={() => console.log("Secondary clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />

    <Toast
      title="Subtle Action"
      description="This toast has a subtle action button."
      actionText="Subtle"
      actionVariant="subtle"
      onAction={() => console.log("Subtle clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />

    <Toast
      title="Outline Action"
      description="This toast has an outline action button."
      actionText="Outline"
      actionVariant="outline"
      onAction={() => console.log("Outline clicked")}
      onClose={() => console.log("Toast closed")}
      autoClose={false}
    />
  </div>
);

export default ToastDemo;
