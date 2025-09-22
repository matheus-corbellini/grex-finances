import { PartialType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./create-account.dto";
import { IsOptional, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
    @ApiPropertyOptional({ description: 'Se a conta está ativa' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
