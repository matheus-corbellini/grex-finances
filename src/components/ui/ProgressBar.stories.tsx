import React from "react";
import { ProgressBar } from "./ProgressBar";

// Simple demonstration of ProgressBar component
export const ProgressBarDemo = () => {
  const [progress, setProgress] = React.useState(65);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Progress Bar Component Demo</h2>

      {/* Basic Progress Bar (like the image) */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Basic Progress Bar (60-65%)</h3>
        <ProgressBar value={65} max={100} />
      </div>

      {/* Progress Bar with Label */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Progress Bar with Label</h3>
        <ProgressBar
          value={progress}
          max={100}
          showLabel={true}
          labelPosition="top"
        />
      </div>

      {/* Different Variants */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Variants</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ProgressBar variant="default" value={75} showLabel={true} />
          <ProgressBar variant="success" value={90} showLabel={true} />
          <ProgressBar variant="warning" value={50} showLabel={true} />
          <ProgressBar variant="error" value={25} showLabel={true} />
          <ProgressBar variant="info" value={60} showLabel={true} />
        </div>
      </div>

      {/* Different Sizes */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ProgressBar size="sm" value={65} showLabel={true} />
          <ProgressBar size="md" value={65} showLabel={true} />
          <ProgressBar size="lg" value={65} showLabel={true} />
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Animated Progress Bar</h3>
        <ProgressBar
          value={progress}
          max={100}
          animated={true}
          showLabel={true}
        />
      </div>

      {/* Striped Progress Bar */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Striped Progress Bar</h3>
        <ProgressBar
          value={75}
          max={100}
          striped={true}
          animated={true}
          showLabel={true}
        />
      </div>

      {/* Indeterminate Progress Bar */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Indeterminate Progress Bar</h3>
        <ProgressBar indeterminate={true} animated={true} />
      </div>

      {/* Different Label Positions */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Label Positions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h4>Top Label</h4>
            <ProgressBar value={65} showLabel={true} labelPosition="top" />
          </div>
          <div>
            <h4>Bottom Label</h4>
            <ProgressBar value={65} showLabel={true} labelPosition="bottom" />
          </div>
          <div>
            <h4>Inside Label</h4>
            <ProgressBar value={65} showLabel={true} labelPosition="inside" />
          </div>
        </div>
      </div>

      {/* Different Label Formats */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Different Label Formats</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ProgressBar
            value={65}
            max={100}
            showLabel={true}
            labelFormat="percentage"
          />
          <ProgressBar
            value={65}
            max={100}
            showLabel={true}
            labelFormat="fraction"
          />
          <ProgressBar
            value={65}
            max={100}
            showLabel={true}
            customLabel="Custom Text"
          />
        </div>
      </div>

      {/* Progress Examples */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Progress Examples</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ProgressBar value={0} showLabel={true} />
          <ProgressBar value={25} showLabel={true} />
          <ProgressBar value={50} showLabel={true} />
          <ProgressBar value={75} showLabel={true} />
          <ProgressBar value={100} showLabel={true} />
        </div>
      </div>
    </div>
  );
};

// Individual Progress Bar Examples
export const BasicProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar value={65} max={100} />
  </div>
);

export const ProgressBarWithLabel = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar value={65} max={100} showLabel={true} labelPosition="top" />
  </div>
);

export const SuccessProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar variant="success" value={90} max={100} showLabel={true} />
  </div>
);

export const WarningProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar variant="warning" value={50} max={100} showLabel={true} />
  </div>
);

export const ErrorProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar variant="error" value={25} max={100} showLabel={true} />
  </div>
);

export const AnimatedProgressBar = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <ProgressBar
        value={progress}
        max={100}
        animated={true}
        showLabel={true}
      />
    </div>
  );
};

export const StripedProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar
      value={75}
      max={100}
      striped={true}
      animated={true}
      showLabel={true}
    />
  </div>
);

export const IndeterminateProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar indeterminate={true} animated={true} />
  </div>
);

export const SmallProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar size="sm" value={65} max={100} showLabel={true} />
  </div>
);

export const LargeProgressBar = () => (
  <div style={{ padding: "20px" }}>
    <ProgressBar size="lg" value={65} max={100} showLabel={true} />
  </div>
);

export default ProgressBarDemo;
