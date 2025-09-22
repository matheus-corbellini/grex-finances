import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, Min, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export enum AccountTypeEnum {
    BANK = 'bank',
    WALLET = 'wallet',
    CREDIT_CARD = 'credit_card',
    SAVINGS = 'savings'
}

export class CreateAccountDto {
    @ApiProperty({ description: 'Nome da conta' })
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({ description: 'Tipo da conta', enum: AccountTypeEnum })
    @IsEnum(AccountTypeEnum)
    type: AccountTypeEnum;

    @ApiPropertyOptional({ description: 'Nome do banco' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    bankName?: string;

    @ApiPropertyOptional({ description: 'Número da conta' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    accountNumber?: string;

    @ApiPropertyOptional({ description: 'Agência' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    agency?: string;

    @ApiProperty({ description: 'Saldo inicial' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    initialBalance: number;

    @ApiPropertyOptional({ description: 'Descrição da conta' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @ApiPropertyOptional({ description: 'Cor da conta' })
    @IsOptional()
    @IsString()
    @MaxLength(7)
    color?: string;

    @ApiPropertyOptional({ description: 'Ícone da conta' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    icon?: string;

    @ApiPropertyOptional({ description: 'Moeda da conta', default: 'BRL' })
    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;
}
