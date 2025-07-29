import React, { useState } from "react";
import { NavigationMenuItem } from "./NavigationMenuItem";

export default {
  title: "UI/NavigationMenuItem",
  component: NavigationMenuItem,
  parameters: {
    layout: "padded",
  },
};

export const Default = () => (
  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
    <NavigationMenuItem>Getting started</NavigationMenuItem>
  </div>
);

export const WithSubmenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <NavigationMenuItem
        hasSubmenu
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Getting started
      </NavigationMenuItem>
    </div>
  );
};

export const Active = () => (
  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
    <NavigationMenuItem variant="active">Getting started</NavigationMenuItem>
  </div>
);

export const Selected = () => (
  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
    <NavigationMenuItem variant="selected">Getting started</NavigationMenuItem>
  </div>
);

export const AllVariants = () => {
  const [expandedStates, setExpandedStates] = useState({
    default: false,
    active: true,
    selected: false,
  });

  const toggleExpanded = (key: keyof typeof expandedStates) => {
    setExpandedStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Default with submenu */}
      <NavigationMenuItem
        hasSubmenu
        isExpanded={expandedStates.default}
        onClick={() => toggleExpanded("default")}
      >
        Getting started
      </NavigationMenuItem>

      {/* Active with submenu */}
      <NavigationMenuItem
        variant="active"
        hasSubmenu
        isExpanded={expandedStates.active}
        onClick={() => toggleExpanded("active")}
      >
        Getting started
      </NavigationMenuItem>

      {/* Selected without submenu */}
      <NavigationMenuItem variant="selected">
        Getting started
      </NavigationMenuItem>

      {/* Default with submenu */}
      <NavigationMenuItem
        hasSubmenu
        isExpanded={expandedStates.selected}
        onClick={() => toggleExpanded("selected")}
      >
        Getting started
      </NavigationMenuItem>

      {/* Active with submenu */}
      <NavigationMenuItem
        variant="active"
        hasSubmenu
        isExpanded={expandedStates.active}
        onClick={() => toggleExpanded("active")}
      >
        Getting started
      </NavigationMenuItem>

      {/* Selected without submenu */}
      <NavigationMenuItem variant="selected">
        Getting started
      </NavigationMenuItem>
    </div>
  );
};
