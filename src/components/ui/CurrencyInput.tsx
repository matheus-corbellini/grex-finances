import React, { useState, useEffect } from 'react';
import styles from './CurrencyInput.module.css';

interface CurrencyInputProps {
    id?: string;
    name?: string;
    label?: string;
    placeholder?: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
    id,
    name,
    label,
    placeholder = "0,00",
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = ""
}) => {
    const [displayValue, setDisplayValue] = useState('');

    // Atualiza o valor de exibição quando o valor prop muda
    useEffect(() => {
        if (value > 0) {
            setDisplayValue(value.toString().replace('.', ','));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    const handleInputChange = (inputValue: string) => {
        // Remove tudo exceto números e vírgula/ponto
        let cleanValue = inputValue.replace(/[^\d,.-]/g, '');

        // Se começar com vírgula ou ponto, adiciona 0 na frente
        if (cleanValue.startsWith(',') || cleanValue.startsWith('.')) {
            cleanValue = '0' + cleanValue;
        }

        // Converte vírgula para ponto para parseFloat
        const numericValue = parseFloat(cleanValue.replace(',', '.')) || 0;

        // Atualiza o valor de exibição
        setDisplayValue(cleanValue);

        // Chama o onChange com o valor numérico
        onChange(numericValue);
    };

    const handleBlur = () => {
        // Formata o valor quando o usuário sai do campo
        if (value > 0) {
            setDisplayValue(value.toFixed(2).replace('.', ','));
        }
    };

    const handleFocus = () => {
        // Remove a formatação quando o usuário foca no campo para facilitar a edição
        if (value > 0) {
            setDisplayValue(value.toString().replace('.', ','));
        }
    };

    return (
        <div className={`${styles.currencyInputContainer} ${className}`}>
            {label && (
                <label className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}
            <div className={styles.currencyInput}>
                <span className={styles.currencySymbol}>R$</span>
                <input
                    id={id}
                    name={name}
                    type="text"
                    className={`${styles.input} ${error ? styles.error : ''}`}
                    placeholder={placeholder}
                    value={displayValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    disabled={disabled}
                />
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default CurrencyInput;
