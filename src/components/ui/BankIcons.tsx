import React from 'react';
import BankIcon from 'react-br-bank-icons';

interface BankIconProps {
    bankName: string;
    size?: number;
    className?: string;
}

export const BankIconComponent: React.FC<BankIconProps> = ({ bankName, size = 24, className = '' }) => {
    const getBankIcon = (bank: string) => {
        switch (bank.toLowerCase()) {
            case 'banco cooperativo sicredi s.a':
                // Ícone personalizado para Sicredi
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <circle cx="12" cy="12" r="10" fill="#E31E24" />
                        <path d="M12 6l-3 6h6l-3-6z" fill="white" />
                        <circle cx="12" cy="12" r="3" fill="#E31E24" />
                    </svg>
                );

            case 'banco do brasil s.a':
                return <BankIcon name="bb" size={size} className={className} />;

            case 'itaú unibanco s.a':
                return <BankIcon name="itau" size={size} className={className} />;

            case 'santander s.a':
                return <BankIcon name="santander" size={size} className={className} />;

            case 'bradesco s.a':
                return <BankIcon name="bradesco" size={size} className={className} />;

            case 'caixa econômica federal':
                return <BankIcon name="caixa" size={size} className={className} />;

            default:
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <rect width="24" height="24" rx="4" fill="#6B7280" />
                        <rect x="6" y="8" width="12" height="8" rx="1" fill="white" />
                        <rect x="8" y="10" width="8" height="1" fill="#6B7280" />
                        <rect x="8" y="12" width="6" height="1" fill="#6B7280" />
                        <rect x="8" y="14" width="8" height="1" fill="#6B7280" />
                    </svg>
                );
        }
    };

    return getBankIcon(bankName);
};

export default BankIcon;
