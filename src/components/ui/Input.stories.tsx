import React, { useState } from "react";
import { Input } from "./Input";

export default {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
};

export const EmailInputsWithSubscribe = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      alignItems: "flex-start",
    }}
  >
    {/* Email Input - Empty/Focused */}
    <Input
      type="email"
      variant="withButton"
      placeholder="Email"
      helpText="Enter your email address"
      buttonText="Subscribe"
      buttonOnClick={() => console.log("Subscribe clicked")}
    />

    {/* Email Input - With Placeholder */}
    <Input
      type="email"
      variant="withButton"
      placeholder="Email"
      helpText="Enter your email address"
      buttonText="Subscribe"
      buttonOnClick={() => console.log("Subscribe clicked")}
    />

    {/* Email Input - Filled */}
    <Input
      type="email"
      variant="withButton"
      placeholder="Email"
      value="moksh@figr.design"
      helpText="Enter your email address"
      buttonText="Subscribe"
      buttonOnClick={() => console.log("Subscribe clicked")}
    />
  </div>
);

export const FileUploadInputs = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      alignItems: "flex-start",
    }}
  >
    {/* File Upload - Empty */}
    <Input
      type="file"
      variant="withButton"
      helpText="Upload a file"
      buttonText="Submit"
      buttonOnClick={() => console.log("Submit clicked")}
    />

    {/* File Upload - With Button */}
    <Input
      type="file"
      variant="withButton"
      helpText="Upload a file"
      buttonText="Submit"
      buttonOnClick={() => console.log("Submit clicked")}
    />
  </div>
);

export const WidthInputs = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      alignItems: "flex-start",
    }}
  >
    {/* Width Input - Empty */}
    <Input type="text" label="Width" placeholder="Add value" />

    {/* Width Input - Filled with Success */}
    <Input type="text" label="Width" value="Add value" success />

    {/* Width Input - Filled with Specific Value */}
    <Input type="text" label="Width" value="100%" />
  </div>
);

export const AllVariants = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      alignItems: "flex-start",
    }}
  >
    {/* Row 1: Email Inputs */}
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <Input
        type="email"
        variant="withButton"
        placeholder="Email"
        helpText="Enter your email address"
        buttonText="Subscribe"
        buttonOnClick={() => console.log("Subscribe clicked")}
      />
      <Input
        type="email"
        variant="withButton"
        placeholder="Email"
        helpText="Enter your email address"
        buttonText="Subscribe"
        buttonOnClick={() => console.log("Subscribe clicked")}
      />
      <Input
        type="email"
        variant="withButton"
        placeholder="Email"
        value="moksh@figr.design"
        helpText="Enter your email address"
        buttonText="Subscribe"
        buttonOnClick={() => console.log("Subscribe clicked")}
      />
    </div>

    {/* Row 2: File Uploads */}
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <Input
        type="email"
        variant="withButton"
        placeholder="Email"
        helpText="Enter your email address"
        buttonText="Subscribe"
        buttonOnClick={() => console.log("Subscribe clicked")}
      />
      <Input
        type="file"
        variant="withButton"
        helpText="Upload a file"
        buttonText="Submit"
        buttonOnClick={() => console.log("Submit clicked")}
      />
      <Input
        type="file"
        variant="withButton"
        helpText="Upload a file"
        buttonText="Submit"
        buttonOnClick={() => console.log("Submit clicked")}
      />
    </div>

    {/* Row 3: Width Inputs */}
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <Input type="text" label="Width" placeholder="Add value" />
      <Input type="text" label="Width" value="Add value" success />
    </div>
  </div>
);

export const InputStates = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "flex-start",
    }}
  >
    {/* Default */}
    <Input type="text" placeholder="Default input" />

    {/* Focused */}
    <Input
      type="text"
      placeholder="Focused input"
      style={{ borderColor: "#07a5f5", boxShadow: "0 0 0 1px #07a5f5" }}
    />

    {/* With Value */}
    <Input type="text" value="Filled input" />

    {/* Success */}
    <Input type="text" value="Success input" success />

    {/* Error */}
    <Input type="text" value="Error input" error="This field is required" />

    {/* Disabled */}
    <Input type="text" placeholder="Disabled input" disabled />

    {/* Required */}
    <Input
      type="text"
      label="Required field"
      placeholder="This field is required"
      required
    />
  </div>
);

export const InputSizes = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "flex-start",
    }}
  >
    <Input type="text" size="sm" placeholder="Small input" />
    <Input type="text" size="md" placeholder="Medium input" />
    <Input type="text" size="lg" placeholder="Large input" />
  </div>
);

export const InputTypes = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      alignItems: "flex-start",
    }}
  >
    <Input type="text" placeholder="Text input" />
    <Input type="email" placeholder="Email input" />
    <Input type="password" placeholder="Password input" />
    <Input type="number" placeholder="Number input" />
    <Input type="file" helpText="File upload" />
  </div>
);

export const InteractiveExample = () => {
  const [email, setEmail] = useState("");
  const [width, setWidth] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribing:", email);
      setIsSuccess(true);
    }
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    setIsSuccess(value.length > 0);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      <Input
        type="email"
        variant="withButton"
        placeholder="Email"
        value={email}
        helpText="Enter your email address"
        buttonText="Subscribe"
        buttonOnClick={handleSubscribe}
        onChange={setEmail}
        success={isSuccess}
      />

      <Input
        type="text"
        label="Width"
        placeholder="Add value"
        value={width}
        onChange={handleWidthChange}
        success={isSuccess}
      />
    </div>
  );
};
