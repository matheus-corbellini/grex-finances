import { IsArray, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkUpdateDto {
    @ApiProperty({ description: 'IDs das transações a serem atualizadas' })
    @IsArray()
    @IsString({ each: true })
    transactionIds: string[];

    @ApiProperty({ description: 'Dados para atualização' })
    @IsObject()
    updateData: Record<string, any>;
}
