import React from 'react';

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
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <rect width="24" height="24" rx="4" fill="#FFD700" />
                        <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#000" fontWeight="bold">BB</text>
                    </svg>
                );

            case 'itaú unibanco s.a':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <rect width="24" height="24" rx="4" fill="#FF6900" />
                        <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#FFF" fontWeight="bold">ITAU</text>
                    </svg>
                );

            case 'santander s.a':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <rect width="24" height="24" rx="4" fill="#EC0000" />
                        <text x="12" y="16" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">SANT</text>
                    </svg>
                );

            case 'bradesco s.a':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <rect width="24" height="24" rx="4" fill="#CC092F" />
                        <text x="12" y="16" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">BRAD</text>
                    </svg>
                );

            case 'caixa econômica federal':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
                        <rect width="24" height="24" rx="4" fill="#003366" />
                        <text x="12" y="16" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="bold">CEF</text>
                    </svg>
                );

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

export default BankIconComponent;
