import { IsNumber, IsOptional, IsString, Min, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AccountBalanceUpdateDto {
    @ApiProperty({ description: 'Novo saldo da conta' })
    @IsNumber({ maxDecimalPlaces: 2 })
    balance: number;

    @ApiPropertyOptional({ description: 'Motivo da alteração de saldo' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    reason?: string;
}
