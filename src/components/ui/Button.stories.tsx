import React, { useState } from "react";
import { Button } from "./Button";

export default {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
};

// Icon components for demonstration
const PencilIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const HouseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const UpDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m7 15 5-5 5 5" />
    <path d="m7 9 5 5 5-5" />
  </svg>
);

export const PrimaryButtons = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="primary">Continue</Button>
    <Button variant="primary">Continue</Button>
    <Button variant="primary">Continue</Button>
    <Button variant="primary">Continue</Button>
    <Button variant="primary" style={{ backgroundColor: "#1e40af" }}>
      Continue
    </Button>
  </div>
);

export const SecondaryButtons = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="secondary">Cancel</Button>
    <Button variant="subtle">Subtle</Button>
    <Button variant="subtle">Subtle</Button>
    <Button variant="subtle">Subtle</Button>
    <Button
      variant="subtle"
      style={{ backgroundColor: "#374151", color: "white" }}
    >
      Subtle
    </Button>
  </div>
);

export const ButtonsWithIcons = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="primary" icon={<PencilIcon />} iconPosition="left">
      Login with Email
    </Button>
    <Button variant="primary" icon={<HouseIcon />} iconPosition="left">
      Login with Email
    </Button>
    <Button variant="secondary" icon={<CheckIcon />} iconPosition="right">
      Cancel
    </Button>
    <Button variant="secondary" icon={<UpDownIcon />} iconPosition="right">
      Cancel
    </Button>
  </div>
);

export const DestructiveButtons = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="destructive" style={{ backgroundColor: "#fecaca" }}>
      Destructive
    </Button>
    <Button variant="destructive" style={{ backgroundColor: "#dc2626" }}>
      Destructive
    </Button>
    <Button variant="destructive" style={{ backgroundColor: "#fca5a5" }}>
      Destructive
    </Button>
    <Button variant="destructive" style={{ backgroundColor: "#b91c1c" }}>
      Destructive
    </Button>
  </div>
);

export const GhostAndLinkButtons = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="ghost" style={{ backgroundColor: "#f3f4f6" }}>
      Ghost
    </Button>
    <Button variant="link">Link</Button>
    <Button variant="link">Link</Button>
  </div>
);

export const CircularAddButtons = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="ghost" size="sm">
      Add
    </Button>
    <Button variant="ghost" size="md">
      Add
    </Button>
    <Button variant="ghost" size="lg">
      Add
    </Button>
    <Button variant="ghost" size="md" style={{ backgroundColor: "#f9fafb" }}>
      Add
    </Button>
  </div>
);

export const LoadingButton = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="primary" loading>
      Loading
    </Button>
  </div>
);

export const AllVariants = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
    {/* Primary Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="primary">Continue</Button>
      <Button variant="primary">Continue</Button>
      <Button variant="primary">Continue</Button>
      <Button variant="primary">Continue</Button>
      <Button variant="primary" style={{ backgroundColor: "#1e40af" }}>
        Continue
      </Button>
    </div>

    {/* Secondary Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="secondary">Cancel</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="subtle">Subtle</Button>
      <Button variant="subtle">Subtle</Button>
      <Button
        variant="subtle"
        style={{ backgroundColor: "#374151", color: "white" }}
      >
        Subtle
      </Button>
    </div>

    {/* Icons Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="primary" icon={<PencilIcon />} iconPosition="left">
        Login with Email
      </Button>
      <Button variant="primary" icon={<HouseIcon />} iconPosition="left">
        Login with Email
      </Button>
      <Button variant="secondary" icon={<CheckIcon />} iconPosition="right">
        Cancel
      </Button>
      <Button variant="secondary" icon={<UpDownIcon />} iconPosition="right">
        Cancel
      </Button>
    </div>

    {/* Destructive Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="destructive" style={{ backgroundColor: "#fecaca" }}>
        Destructive
      </Button>
      <Button variant="destructive" style={{ backgroundColor: "#dc2626" }}>
        Destructive
      </Button>
      <Button variant="destructive" style={{ backgroundColor: "#fca5a5" }}>
        Destructive
      </Button>
      <Button variant="destructive" style={{ backgroundColor: "#b91c1c" }}>
        Destructive
      </Button>
    </div>

    {/* Ghost and Link Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="ghost" style={{ backgroundColor: "#f3f4f6" }}>
        Ghost
      </Button>
      <Button variant="link">Link</Button>
      <Button variant="link">Link</Button>
    </div>

    {/* Circular Add Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="ghost" size="sm">
        Add
      </Button>
      <Button variant="ghost" size="md">
        Add
      </Button>
      <Button variant="ghost" size="lg">
        Add
      </Button>
      <Button variant="ghost" size="md" style={{ backgroundColor: "#f9fafb" }}>
        Add
      </Button>
    </div>

    {/* Loading Row */}
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Button variant="primary" loading>
        Loading
      </Button>
    </div>
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="primary" size="sm">
      Small
    </Button>
    <Button variant="primary" size="md">
      Medium
    </Button>
    <Button variant="primary" size="lg">
      Large
    </Button>
  </div>
);

export const States = () => (
  <div
    style={{
      display: "flex",
      gap: "16px",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    <Button variant="primary">Normal</Button>
    <Button variant="primary" disabled>
      Disabled
    </Button>
    <Button variant="primary" loading>
      Loading
    </Button>
  </div>
);
