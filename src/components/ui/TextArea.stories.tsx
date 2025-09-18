import React from "react";
import { Textarea } from "./TextArea";

// Simple demonstration of TextArea component
export const TextAreaDemo = () => {
  const [message, setMessage] = React.useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setIsSubmitted(true);
      console.log("Message sent:", message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>TextArea Component Demo</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <TextArea
            label="Your message"
            placeholder="Type your message here"
            variant="withButton"
            buttonText="Send message"
            buttonOnClick={handleSend}
            rows={4}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TextArea
            label="Your message"
            placeholder="Type your message here"
            helpText="Your message will be copied to the support team."
            rows={4}
          />
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <TextArea label="Focused State" placeholder="Click to focus" rows={4} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <TextArea
          label="Error State"
          placeholder="Error textarea"
          error="This field is required"
          rows={4}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <TextArea
          label="Success State"
          placeholder="Success textarea"
          success={true}
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
