import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { WebhooksService } from "./webhooks.service";
import { CreateWebhookDto, UpdateWebhookDto } from "./dto/webhook.dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags('Webhooks')
@Controller("webhooks")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) { }

    @Post()
    @ApiOperation({ summary: 'Criar novo webhook' })
    @ApiResponse({ status: 201, description: 'Webhook criado com sucesso' })
    async create(@Request() req: any, @Body() createDto: CreateWebhookDto) {
        const userId = req.user.id;
        return this.webhooksService.create(userId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Listar webhooks do usuário' })
    @ApiResponse({ status: 200, description: 'Lista de webhooks' })
    async findAll(@Request() req: any) {
        const userId = req.user.id;
        return this.webhooksService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter webhook por ID' })
    @ApiResponse({ status: 200, description: 'Webhook encontrado' })
    async findOne(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        return this.webhooksService.findOne(userId, id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar webhook' })
    @ApiResponse({ status: 200, description: 'Webhook atualizado com sucesso' })
    async update(
        @Request() req: any,
        @Param('id') id: string,
        @Body() updateDto: UpdateWebhookDto
    ) {
        const userId = req.user.id;
        return this.webhooksService.update(userId, id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remover webhook' })
    @ApiResponse({ status: 200, description: 'Webhook removido com sucesso' })
    async remove(@Request() req: any, @Param('id') id: string) {
        const userId = req.user.id;
        await this.webhooksService.remove(userId, id);
        return { message: 'Webhook removido com sucesso' };
    }

    @Get(':id/logs')
    @ApiOperation({ summary: 'Obter logs de um webhook' })
    @ApiResponse({ status: 200, description: 'Logs do webhook' })
    @ApiQuery({ name: 'limit', required: false, description: 'Limite de resultados' })
    @ApiQuery({ name: 'offset', required: false, description: 'Offset para paginação' })
    async getLogs(
        @Request() req: any,
        @Param('id') id: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number
    ) {
        const userId = req.user.id;
        return this.webhooksService.getWebhookLogs(userId, id, limit || 50, offset || 0);
    }
}
