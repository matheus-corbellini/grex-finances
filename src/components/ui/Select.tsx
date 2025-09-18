import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

function Select({
    value,
    onChange,
    children,
    placeholder = "Selecione uma opção",
    error,
    disabled = false,
    className = ""
}: SelectProps) {
    return (
        <div className={`${styles.selectContainer} ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`${styles.select} ${error ? styles.selectError : ''} ${disabled ? styles.selectDisabled : ''}`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {children}
            </select>
            <ChevronDown size={16} className={styles.selectIcon} />
            {error && (
                <span className={styles.errorMessage}>
                    {error}
                </span>
            )}
        </div>
    );
}

export { Select };
export default Select;
