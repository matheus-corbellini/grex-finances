import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { ApiKeysService } from "./api-keys.service";
import { CreateApiKeyDto, UpdateApiKeyDto, ApiKeyFiltersDto } from "./dto/api-key.dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags('API Keys')
@Controller("api-keys")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApiKeysController {
    constructor(private readonly apiKeysService: ApiKeysService) { }

    @Post()
    @ApiOperation({ summary: 'Criar nova chave API' })
    @ApiResponse({ status: 201, description: 'Chave API criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    async create(@Request() req: any, @Body() createDto: CreateApiKeyDto) {
        const userId = req.user.id;
        return this.apiKeysService.create(userId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar chaves API do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de chaves API' })
    @ApiQuery({ name: 'isActive', required: false, description: 'Filtrar por status ativo' })
    @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome' })
    async findAll(@Request() req: any, @Query() filters?: ApiKeyFiltersDto) {
        const userId = req.user.id;
        return this.apiKeysService.findAll(userId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter chave API por ID' })
    @ApiResponse({ status: 200, description: 'Chave API encontrada' })
    @ApiResponse({ status: 404, description: 'Chave API não encontrada' })
    async findOne(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        return this.apiKeysService.findOne(userId, id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar chave API' })
    @ApiResponse({ status: 200, description: 'Chave API atualizada com sucesso' })
    @ApiResponse({ status: 404, description: 'Chave API não encontrada' })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateDto: UpdateApiKeyDto
    ) {
        const userId = req.user.id;
        return this.apiKeysService.update(userId, id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover chave API' })
    @ApiResponse({ status: 200, description: 'Chave API removida com sucesso' })
    @ApiResponse({ status: 404, description: 'Chave API não encontrada' })
    async remove(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        await this.apiKeysService.remove(userId, id);
        return { message: 'Chave API removida com sucesso' };
    }
}
