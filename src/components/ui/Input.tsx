"use client";

import React, { useState, useEffect, forwardRef, useId } from "react";
import { useTheme } from "../../context/ThemeContext";

export interface InputProps {
  type?: "text" | "email" | "password" | "number" | "file" | "date";
  variant?: "default" | "withButton" | "withLabel" | "withHelpText";
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
  step?: string;
  min?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
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
      step,
      min,
      onChange,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const uniqueId = useId();

    // Update inputValue when value prop changes
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    // Generate unique ID if not provided
    const inputId = id || `input-${uniqueId}`;

    // Base input styles using design system
    const getBaseInputStyles = (): React.CSSProperties => ({
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
      minHeight: size === "lg" ? "48px" : size === "sm" ? "32px" : "40px",
      cursor: disabled ? "not-allowed" : "text",
      opacity: disabled ? 0.6 : 1,
    });

    // Size-specific styles
    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case "sm":
          return {
            fontSize: theme.getFontSize("sm"),
            padding: `${theme.getSpacing("xs")} ${theme.getSpacing("s")}`,
            minHeight: "32px",
          };
        case "lg":
          return {
            fontSize: theme.getFontSize("lg"),
            padding: `${theme.getSpacing("m")} ${theme.getSpacing("l")}`,
            minHeight: "48px",
          };
        default: // md
          return {
            fontSize: theme.getFontSize("base"),
            padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
            minHeight: "40px",
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
          top: "50%",
          transform: "translateY(-50%)",
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

    // Check icon component
    const CheckIcon = () => (
      <svg
        style={{
          width: "16px",
          height: "16px",
          color: theme.colors.primary[600],
          position: "absolute",
          right: theme.getSpacing("m"),
          top: "50%",
          transform: "translateY(-50%)",
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
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

    const inputStyles = {
      ...getBaseInputStyles(),
      ...getSizeStyles(),
      ...getStateStyles(),
      ...style,
    };

    // File upload variant
    if (type === "file") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.getSpacing("s"),
            width: fullWidth ? "100%" : "auto",
          }}
          className={`input input--file input--${variant} input--${size} ${className}`}
        >
          {label && (
            <label htmlFor={inputId} style={getLabelStyles()}>
              {label}
              {required && (
                <span style={{ color: theme.colors.error[200] }}> *</span>
              )}
            </label>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.getSpacing("m"),
            }}
          >
            <input
              ref={ref}
              id={inputId}
              name={name || inputId}
              type="file"
              step={step}
              min={min}
              style={{
                ...inputStyles,
                display: "none",
              }}
              disabled={disabled}
              required={required}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={() =>
                (
                  document.querySelector(`#${inputId}`) as HTMLInputElement
                )?.click()
              }
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("base"),
                fontWeight: theme.getFontWeight("bold"),
                color: theme.colors.primary[600],
                backgroundColor: "transparent",
                border: `1px solid ${theme.colors.primary[600]}`,
                borderRadius: theme.getRadius("m"),
                padding: `${theme.getSpacing("s")} ${theme.getSpacing("m")}`,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
              }}
              disabled={disabled}
            >
              Choose File
            </button>
            <span
              style={{
                fontFamily: theme.getFontFamily("primary"),
                fontSize: theme.getFontSize("base"),
                color: theme.colors.neutrals[600],
              }}
            >
              No file chosen
            </span>
          </div>
          {helpText && <span style={getHelpTextStyles()}>{helpText}</span>}
          {error && <span style={getErrorTextStyles()}>{error}</span>}
        </div>
      );
    }

    // Input with button variant
    if (variant === "withButton" && buttonText) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.getSpacing("s"),
            width: fullWidth ? "100%" : "auto",
          }}
          className={`input input--with-button input--${size} ${className}`}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.getSpacing("m"),
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <input
                ref={ref}
                id={inputId}
                name={name || inputId}
                type={type}
                step={step}
                min={min}
                placeholder={placeholder}
                value={inputValue}
                style={inputStyles}
                disabled={disabled}
                required={required}
                onChange={handleInputChange}
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
                minHeight:
                  size === "lg" ? "48px" : size === "sm" ? "32px" : "40px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
                transition: "all 0.2s ease-in-out",
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

    // Default input with label
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.getSpacing("s"),
          width: fullWidth ? "100%" : "auto",
        }}
        className={`input input--${variant} input--${size} ${className}`}
      >
        {label && (
          <label htmlFor={inputId} style={getLabelStyles()}>
            {label}
            {required && (
              <span style={{ color: theme.colors.error[200] }}> *</span>
            )}
          </label>
        )}
        <div style={{ position: "relative" }}>
          <input
            ref={ref}
            id={inputId}
            name={name || inputId}
            type={type}
            step={step}
            min={min}
            placeholder={placeholder}
            value={inputValue}
            style={inputStyles}
            disabled={disabled}
            required={required}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {success && <CheckIcon />}
        </div>
        {helpText && <span style={getHelpTextStyles()}>{helpText}</span>}
        {error && <span style={getErrorTextStyles()}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
