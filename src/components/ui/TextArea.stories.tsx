import React from "react";
import { Textarea } from "./TextArea";

// Simple demonstration of Textarea component
export const TextAreaDemo = () => {
  const [message, setMessage] = React.useState("");
  const [message2, setMessage2] = React.useState("");
  const [focusedValue, setFocusedValue] = React.useState("");
  const [errorValue, setErrorValue] = React.useState("");
  const [successValue, setSuccessValue] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setIsSubmitted(true);
      console.log("Message sent:", message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Textarea Component Demo</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
            rows={4}
            maxLength={200}
          />
          <div style={{ marginTop: "8px" }}>
            <button onClick={handleSend}>Send message</button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <Textarea
            value={message2}
            onChange={(e) => setMessage2(e.target.value)}
            placeholder="Type your message here"
            rows={4}
            maxLength={120}
          />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Textarea
          value={focusedValue}
          onChange={(e) => setFocusedValue(e.target.value)}
          placeholder="Click to focus"
          rows={4}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Textarea
          value={errorValue}
          onChange={(e) => setErrorValue(e.target.value)}
          placeholder="Error textarea"
          error="This field is required"
          rows={4}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <Textarea
          value={successValue}
          onChange={(e) => setSuccessValue(e.target.value)}
          placeholder="Success textarea"
          rows={4}
        />
      </div>

      {isSubmitted && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e8f5e8",
            borderRadius: "4px",
            marginTop: "10px",
          }}
        >
          Message sent successfully!
        </div>
      )}
    </div>
  );
};

export default TextAreaDemo;
