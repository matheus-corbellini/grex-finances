"use client";

import React, { useState, forwardRef } from "react";
import { useTheme } from "../../context/ThemeContext";

export interface TextAreaProps {
  variant?: "default" | "withButton" | "withHelpText";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  value?: string;
  label?: string;
  helpText?: string;
  buttonText?: string;
  buttonVariant?: "primary" | "secondary" | "subtle";
  buttonOnClick?: () => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  rows?: number;
  maxRows?: number;
  minRows?: number;
  resizable?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = "default",
      size = "md",
      placeholder,
      value = "",
      label,
      helpText,
      buttonText,
      buttonVariant = "primary",
      buttonOnClick,
      error,
      success = false,
      disabled = false,
      required = false,
      fullWidth = false,
      className = "",
      style,
      id,
      name,
      rows = 4,
      maxRows,
      minRows,
      resizable = true,
      onChange,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [textareaValue, setTextareaValue] = useState(value);

    // Generate unique ID if not provided
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Base textarea styles using design system
    const getBaseTextareaStyles = (): React.CSSProperties => ({
      fontFamily: theme.getFontFamily("primary"),
      fontSize: theme.getFontSize("base"),
      fontWeight: theme.getFontWeight("secondary"),
      lineHeight: theme.getLineHeight("normal"),
      letterSpacing: theme.getLetterSpacing("normal"),
      color: theme.colors.baseBlack,
      backgroundColor: theme.colors.baseWhite,
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: theme.colors.neutrals[200],
      borderRadius: theme.getRadius("m"),
      padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
      outline: "none",
      transition: "all 0.2s ease-in-out",
      width: fullWidth ? "100%" : "auto",
      minHeight: size === "lg" ? "120px" : size === "sm" ? "80px" : "100px",
      cursor: disabled ? "not-allowed" : "text",
      opacity: disabled ? 0.6 : 1,
      resize: resizable ? "vertical" : "none",
      font: "inherit",
    });

    // Size-specific styles
    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case "sm":
          return {
            fontSize: theme.getFontSize("sm"),
            padding: `${theme.getSpacing("xs")} ${theme.getSpacing("s")}`,
            minHeight: "80px",
          };
        case "lg":
          return {
            fontSize: theme.getFontSize("lg"),
            padding: `${theme.getSpacing("m")} ${theme.getSpacing("l")}`,
            minHeight: "120px",
          };
        default: // md
          return {
            fontSize: theme.getFontSize("base"),
            padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
            minHeight: "100px",
          };
      }
    };

    // State-specific styles
    const getStateStyles = (): React.CSSProperties => {
      if (error) {
        return {
          borderColor: theme.colors.error[200],
          boxShadow: `0 0 0 1px ${theme.colors.error[200]}`,
        };
      }
      if (isFocused) {
        return {
          borderColor: theme.colors.primary[600],
          boxShadow: `0 0 0 1px ${theme.colors.primary[600]}`,
        };
      }
      if (success) {
        return {
          borderColor: theme.colors.success[200],
          boxShadow: `0 0 0 1px ${theme.colors.success[200]}`,
        };
      }
      return {};
    };

    // Label styles
    const getLabelStyles = (): React.CSSProperties => ({
      fontFamily: theme.getFontFamily("primary"),
      fontSize: theme.getFontSize("sm"),
      fontWeight: theme.getFontWeight("bold"),
      color: theme.colors.baseBlack,
      marginBottom: theme.getSpacing("xs"),
      display: "block",
    });

    // Help text styles
    const getHelpTextStyles = (): React.CSSProperties => ({
      fontFamily: theme.getFontFamily("primary"),
      fontSize: theme.getFontSize("sm"),
      fontWeight: theme.getFontWeight("secondary"),
      color: theme.colors.neutrals[600],
      marginTop: theme.getSpacing("xs"),
      display: "block",
    });

    // Error text styles
    const getErrorTextStyles = (): React.CSSProperties => ({
      fontFamily: theme.getFontFamily("primary"),
      fontSize: theme.getFontSize("sm"),
      fontWeight: theme.getFontWeight("secondary"),
      color: theme.colors.error[200],
      marginTop: theme.getSpacing("xs"),
      display: "block",
    });

    // Success icon component
    const SuccessIcon = () => (
      <svg
        style={{
          width: "16px",
          height: "16px",
          color: theme.colors.success[200],
          position: "absolute",
          right: theme.getSpacing("m"),
          top: theme.getSpacing("m"),
        }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20,6 9,17 4,12" />
      </svg>
    );

    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const newValue = e.target.value;
      setTextareaValue(newValue);
      onChange?.(newValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const textareaStyles = {
      ...getBaseTextareaStyles(),
      ...getSizeStyles(),
      ...getStateStyles(),
      ...style,
    };

    // TextArea with button variant
    if (variant === "withButton" && buttonText) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.getSpacing("s"),
            width: fullWidth ? "100%" : "auto",
          }}
          className={`textarea textarea--with-button textarea--${size} ${className}`}
        >
          {label && (
            <label htmlFor={textareaId} style={getLabelStyles()}>
              {label}
              {required && (
                <span style={{ color: theme.colors.error[200] }}> *</span>
              )}
            </label>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.getSpacing("m"),
            }}
          >
            <div style={{ position: "relative" }}>
              <textarea
                ref={ref}
                id={textareaId}
                name={name || textareaId}
                placeholder={placeholder}
                value={textareaValue}
                rows={rows}
                style={textareaStyles}
                disabled={disabled}
                required={required}
                onChange={handleTextareaChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {success && <SuccessIcon />}
            </div>
            <button
              type="button"
              onClick={buttonOnClick}
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("base"),
                fontWeight: theme.getFontWeight("medium"),
                color: theme.colors.baseWhite,
                backgroundColor: theme.colors.primary[600],
                border: "none",
                borderRadius: theme.getRadius("m"),
                padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
                transition: "all 0.2s ease-in-out",
                alignSelf: "flex-start",
              }}
              disabled={disabled}
            >
              {buttonText}
            </button>
          </div>
          {helpText && <span style={getHelpTextStyles()}>{helpText}</span>}
          {error && <span style={getErrorTextStyles()}>{error}</span>}
        </div>
      );
    }

    // Default textarea with label
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.getSpacing("s"),
          width: fullWidth ? "100%" : "auto",
        }}
        className={`textarea textarea--${variant} textarea--${size} ${className}`}
      >
        {label && (
          <label htmlFor={textareaId} style={getLabelStyles()}>
            {label}
            {required && (
              <span style={{ color: theme.colors.error[200] }}> *</span>
            )}
          </label>
        )}
        <div style={{ position: "relative" }}>
          <textarea
            ref={ref}
            id={textareaId}
            name={name || textareaId}
            placeholder={placeholder}
            value={textareaValue}
            rows={rows}
            style={textareaStyles}
            disabled={disabled}
            required={required}
            onChange={handleTextareaChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {success && <SuccessIcon />}
        </div>
        {helpText && <span style={getHelpTextStyles()}>{helpText}</span>}
        {error && <span style={getErrorTextStyles()}>{error}</span>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
