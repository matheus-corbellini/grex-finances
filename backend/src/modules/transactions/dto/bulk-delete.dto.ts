import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BulkDeleteDto {
    @ApiProperty({ description: 'IDs das transações a serem excluídas' })
    @IsArray()
    @IsString({ each: true })
    transactionIds: string[];
}
