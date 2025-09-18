import React from 'react';
import styles from './Textarea.module.css';

interface TextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  error,
  disabled = false,
  className = ""
}: TextareaProps) {
  return (
    <div className={`${styles.textareaContainer} ${className}`}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={`${styles.textarea} ${error ? styles.textareaError : ''} ${disabled ? styles.textareaDisabled : ''}`}
      />
      {maxLength && (
        <div className={styles.characterCount}>
          {value.length}/{maxLength}
        </div>
      )}
      {error && (
        <span className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
}

export { Textarea };
export default Textarea;