import { IsString, IsOptional, IsBoolean, IsEnum, IsNumber, IsDateString, Min, Max, MinLength, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CreditCardBrand, CreditCardStatus } from "../entities/credit-card.entity";

export class CreateCreditCardDto {
    @ApiProperty({ example: "Cartão Principal" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiPropertyOptional({ example: "Cartão de crédito principal da igreja" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({ example: "visa", enum: CreditCardBrand })
    @IsEnum(CreditCardBrand)
    brand: CreditCardBrand;

    @ApiProperty({ example: "1234" })
    @IsString()
    @MinLength(4)
    @MaxLength(4)
    lastFourDigits: string;

    @ApiPropertyOptional({ example: "João Silva" })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    holderName?: string;

    @ApiProperty({ example: 5000.00 })
    @IsNumber()
    @Min(0)
    creditLimit: number;

    @ApiPropertyOptional({ example: 2.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    interestRate?: number;

    @ApiPropertyOptional({ example: 120.00 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    annualFee?: number;

    @ApiPropertyOptional({ example: "2025-12-31" })
    @IsOptional()
    @IsDateString()
    expirationDate?: Date;

    @ApiPropertyOptional({ example: "2024-01-15" })
    @IsOptional()
    @IsDateString()
    closingDate?: Date;

    @ApiPropertyOptional({ example: "2024-01-20" })
    @IsOptional()
    @IsDateString()
    dueDate?: Date;

    @ApiPropertyOptional({ example: "active", enum: CreditCardStatus })
    @IsOptional()
    @IsEnum(CreditCardStatus)
    status?: CreditCardStatus;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({ example: "ext_123456" })
    @IsOptional()
    @IsString()
    externalId?: string;

    @ApiPropertyOptional({ example: { bankName: "Banco do Brasil", notes: "Cartão corporativo" } })
    @IsOptional()
    metadata?: {
        bankName?: string;
        accountNumber?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        notes?: string;
    };
}

export class UpdateCreditCardDto {
    @ApiPropertyOptional({ example: "Cartão Principal" })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name?: string;

    @ApiPropertyOptional({ example: "Cartão de crédito principal da igreja" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiPropertyOptional({ example: "João Silva" })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    holderName?: string;

    @ApiPropertyOptional({ example: 5000.00 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    creditLimit?: number;

    @ApiPropertyOptional({ example: 4500.00 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    availableLimit?: number;

    @ApiPropertyOptional({ example: 2.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    interestRate?: number;

    @ApiPropertyOptional({ example: 120.00 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    annualFee?: number;

    @ApiPropertyOptional({ example: "2025-12-31" })
    @IsOptional()
    @IsDateString()
    expirationDate?: Date;

    @ApiPropertyOptional({ example: "2024-01-15" })
    @IsOptional()
    @IsDateString()
    closingDate?: Date;

    @ApiPropertyOptional({ example: "2024-01-20" })
    @IsOptional()
    @IsDateString()
    dueDate?: Date;

    @ApiPropertyOptional({ example: "active", enum: CreditCardStatus })
    @IsOptional()
    @IsEnum(CreditCardStatus)
    status?: CreditCardStatus;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;

    @ApiPropertyOptional({ example: { bankName: "Banco do Brasil", notes: "Cartão corporativo" } })
    @IsOptional()
    metadata?: {
        bankName?: string;
        accountNumber?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        notes?: string;
    };
}

export class CreditCardResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    brand: CreditCardBrand;

    @ApiProperty()
    lastFourDigits: string;

    @ApiProperty()
    holderName?: string;

    @ApiProperty()
    creditLimit: number;

    @ApiProperty()
    availableLimit: number;

    @ApiProperty()
    currentBalance: number;

    @ApiProperty()
    interestRate: number;

    @ApiProperty()
    annualFee: number;

    @ApiProperty()
    expirationDate?: Date;

    @ApiProperty()
    closingDate?: Date;

    @ApiProperty()
    dueDate?: Date;

    @ApiProperty()
    status: CreditCardStatus;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isDefault: boolean;

    @ApiProperty()
    externalId?: string;

    @ApiProperty()
    metadata?: {
        bankName?: string;
        accountNumber?: string;
        phoneNumber?: string;
        email?: string;
        address?: string;
        notes?: string;
    };

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class CreditCardStatsDto {
    @ApiProperty()
    totalCards: number;

    @ApiProperty()
    activeCards: number;

    @ApiProperty()
    totalCreditLimit: number;

    @ApiProperty()
    totalAvailableLimit: number;

    @ApiProperty()
    totalCurrentBalance: number;

    @ApiProperty()
    utilizationRate: number;

    @ApiProperty()
    averageInterestRate: number;

    @ApiProperty()
    totalAnnualFees: number;

    @ApiProperty()
    cardsByBrand: Record<CreditCardBrand, number>;

    @ApiProperty()
    upcomingPayments: Array<{
        cardId: string;
        cardName: string;
        dueDate: Date;
        amount: number;
        daysUntilDue: number;
    }>;
}
