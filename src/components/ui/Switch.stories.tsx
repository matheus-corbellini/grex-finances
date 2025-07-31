import React from "react";
import { Switch } from "./Switch";

// Simple demonstration of Switch component
export const SwitchDemo = () => {
  const [airplaneMode, setAirplaneMode] = React.useState(false);
  const [wifiEnabled, setWifiEnabled] = React.useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = React.useState(false);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Switch Component Demo</h2>

      {/* Basic Switches (like the image) */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Basic Switches (like the image)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch
            checked={airplaneMode}
            onChange={setAirplaneMode}
            label="Airplane mode"
          />
          <Switch
            checked={wifiEnabled}
            onChange={setWifiEnabled}
            label="Airplane mode"
          />
        </div>
      </div>

      {/* Multiple Switches Side by Side */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Multiple Switches Side by Side (like the image)</h3>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Switch
            checked={airplaneMode}
            onChange={setAirplaneMode}
            label="Airplane mode"
          />
          <Switch
            checked={wifiEnabled}
            onChange={setWifiEnabled}
            label="Airplane mode"
          />
        </div>
      </div>

      {/* Different Variants */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Variants</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch
            checked={true}
            variant="default"
            label="Default Switch (ON)"
          />
          <Switch
            checked={true}
            variant="success"
            label="Success Switch (ON)"
          />
          <Switch
            checked={true}
            variant="warning"
            label="Warning Switch (ON)"
          />
          <Switch checked={true} variant="error" label="Error Switch (ON)" />
        </div>
      </div>

      {/* Different Sizes */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch size="sm" checked={true} label="Small Switch" />
          <Switch size="md" checked={true} label="Medium Switch (default)" />
          <Switch size="lg" checked={true} label="Large Switch" />
        </div>
      </div>

      {/* States */}
      <div style={{ marginBottom: "30px" }}>
        <h3>States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch checked={false} label="OFF State" />
          <Switch checked={true} label="ON State" />
          <Switch checked={false} disabled={true} label="Disabled OFF" />
          <Switch checked={true} disabled={true} label="Disabled ON" />
        </div>
      </div>

      {/* Label Positions */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Label Positions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch checked={true} labelPosition="left" label="Label on Left" />
          <Switch checked={true} labelPosition="right" label="Label on Right" />
        </div>
      </div>

      {/* Without Labels */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Without Labels</h3>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Switch checked={false} showLabel={false} />
          <Switch checked={true} showLabel={false} />
        </div>
      </div>

      {/* Interactive Examples */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Interactive Examples</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch
            checked={airplaneMode}
            onChange={setAirplaneMode}
            label="Airplane Mode"
          />
          <Switch
            checked={wifiEnabled}
            onChange={setWifiEnabled}
            label="Wi-Fi"
          />
          <Switch
            checked={bluetoothEnabled}
            onChange={setBluetoothEnabled}
            label="Bluetooth"
          />
        </div>
      </div>

      {/* Custom Labels */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Custom Labels</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch checked={true} label="Modo Avião" />
          <Switch checked={false} label="Wi-Fi" />
          <Switch checked={true} label="Bluetooth" />
          <Switch checked={false} label="Notificações" />
        </div>
      </div>

      {/* Controlled vs Uncontrolled */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Controlled vs Uncontrolled</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Switch
            checked={airplaneMode}
            onChange={setAirplaneMode}
            label="Controlled Switch"
          />
          <Switch
            defaultChecked={true}
            label="Uncontrolled Switch (default ON)"
          />
          <Switch
            defaultChecked={false}
            label="Uncontrolled Switch (default OFF)"
          />
        </div>
      </div>
    </div>
  );
};

// Individual Switch Examples
export const SwitchOff = () => (
  <div style={{ padding: "20px" }}>
    <Switch checked={false} label="Airplane mode" />
  </div>
);

export const SwitchOn = () => (
  <div style={{ padding: "20px" }}>
    <Switch checked={true} label="Airplane mode" />
  </div>
);

export const SwitchDisabled = () => (
  <div style={{ padding: "20px" }}>
    <Switch checked={false} disabled={true} label="Airplane mode" />
  </div>
);

export const SwitchDisabledOn = () => (
  <div style={{ padding: "20px" }}>
    <Switch checked={true} disabled={true} label="Airplane mode" />
  </div>
);

export const SmallSwitch = () => (
  <div style={{ padding: "20px" }}>
    <Switch size="sm" checked={true} label="Small Switch" />
  </div>
);

export const LargeSwitch = () => (
  <div style={{ padding: "20px" }}>
    <Switch size="lg" checked={true} label="Large Switch" />
  </div>
);

export const SuccessSwitch = () => (
  <div style={{ padding: "20px" }}>
    <Switch variant="success" checked={true} label="Success Switch" />
  </div>
);

export const WarningSwitch = () => (
  <div style={{ padding: "20px" }}>
    <Switch variant="warning" checked={true} label="Warning Switch" />
  </div>
);

export const ErrorSwitch = () => (
  <div style={{ padding: "20px" }}>
    <Switch variant="error" checked={true} label="Error Switch" />
  </div>
);

export const SwitchWithLeftLabel = () => (
  <div style={{ padding: "20px" }}>
    <Switch checked={true} label="Airplane mode" labelPosition="left" />
  </div>
);

export const SwitchWithoutLabel = () => (
  <div style={{ padding: "20px" }}>
    <Switch checked={true} showLabel={false} />
  </div>
);

export const InteractiveSwitch = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <div style={{ padding: "20px" }}>
      <Switch
        checked={isChecked}
        onChange={setIsChecked}
        label="Interactive Switch"
      />
      <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        Status: {isChecked ? "ON" : "OFF"}
      </p>
    </div>
  );
};

export default SwitchDemo;
