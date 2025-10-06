import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CreditCardsService } from "./credit-cards.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { Permission } from "../users/entities/role.entity";
import {
    CreateCreditCardDto,
    UpdateCreditCardDto,
    CreditCardResponseDto,
    CreditCardStatsDto
} from "./dto/credit-card.dto";
import { CreditCardStatus, CreditCardBrand } from "./entities/credit-card.entity";

@ApiTags("Credit Cards")
@Controller("credit-cards")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CreditCardsController {
    constructor(private readonly creditCardsService: CreditCardsService) { }

    // ===== CRUD ENDPOINTS =====

    @Post()
    @UseGuards(PermissionGuard(Permission.ACCOUNT_CREATE))
    @ApiOperation({ summary: "Criar novo cartão de crédito" })
    @ApiResponse({ status: 201, description: "Cartão criado com sucesso", type: CreditCardResponseDto })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 409, description: "Cartão já existe" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async create(@Request() req: any, @Body() createCreditCardDto: CreateCreditCardDto): Promise<CreditCardResponseDto> {
        const userId = req.user.id;
        return this.creditCardsService.create(userId, createCreditCardDto);
    }

    @Get()
    @UseGuards(PermissionGuard(Permission.ACCOUNT_READ))
    @ApiOperation({ summary: "Listar cartões de crédito" })
    @ApiQuery({ name: "status", required: false, enum: CreditCardStatus, description: "Filtrar por status" })
    @ApiQuery({ name: "brand", required: false, enum: CreditCardBrand, description: "Filtrar por bandeira" })
    @ApiResponse({ status: 200, description: "Lista de cartões", type: [CreditCardResponseDto] })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async findAll(
        @Request() req: any,
        @Query("status") status?: CreditCardStatus,
        @Query("brand") brand?: CreditCardBrand
    ): Promise<CreditCardResponseDto[]> {
        const userId = req.user.id;
        return this.creditCardsService.findAll(userId, status, brand);
    }

    @Get("stats")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_READ))
    @ApiOperation({ summary: "Obter estatísticas dos cartões" })
    @ApiResponse({ status: 200, description: "Estatísticas dos cartões", type: CreditCardStatsDto })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async getStats(@Request() req: any): Promise<CreditCardStatsDto> {
        const userId = req.user.id;
        return this.creditCardsService.getStats(userId);
    }

    @Get("near-limit")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_READ))
    @ApiOperation({ summary: "Obter cartões próximos do limite" })
    @ApiQuery({ name: "threshold", required: false, type: Number, description: "Percentual de utilização (padrão: 80)" })
    @ApiResponse({ status: 200, description: "Cartões próximos do limite", type: [CreditCardResponseDto] })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async getCardsNearLimit(
        @Request() req: any,
        @Query("threshold") threshold?: number
    ): Promise<CreditCardResponseDto[]> {
        const userId = req.user.id;
        return this.creditCardsService.getCardsNearLimit(userId, threshold || 80);
    }

    @Get(":id")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_READ))
    @ApiOperation({ summary: "Obter cartão por ID" })
    @ApiResponse({ status: 200, description: "Cartão encontrado", type: CreditCardResponseDto })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async findOne(@Request() req: any, @Param("id", ParseUUIDPipe) id: string): Promise<CreditCardResponseDto> {
        const userId = req.user.id;
        return this.creditCardsService.findOne(userId, id);
    }

    @Put(":id")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_UPDATE))
    @ApiOperation({ summary: "Atualizar cartão de crédito" })
    @ApiResponse({ status: 200, description: "Cartão atualizado com sucesso", type: CreditCardResponseDto })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async update(
        @Request() req: any,
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updateCreditCardDto: UpdateCreditCardDto
    ): Promise<CreditCardResponseDto> {
        const userId = req.user.id;
        return this.creditCardsService.update(userId, id, updateCreditCardDto);
    }

    @Delete(":id")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_DELETE))
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Remover cartão de crédito (soft delete)" })
    @ApiResponse({ status: 204, description: "Cartão removido com sucesso" })
    @ApiResponse({ status: 400, description: "Cartão com transações pendentes" })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async remove(@Request() req: any, @Param("id", ParseUUIDPipe) id: string): Promise<void> {
        const userId = req.user.id;
        return this.creditCardsService.remove(userId, id);
    }

    // ===== TRANSACTION ENDPOINTS =====

    @Post(":id/transactions")
    @UseGuards(PermissionGuard(Permission.TRANSACTION_CREATE))
    @ApiOperation({ summary: "Adicionar transação ao cartão" })
    @ApiResponse({ status: 201, description: "Transação adicionada com sucesso" })
    @ApiResponse({ status: 400, description: "Valor excede limite disponível" })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async addTransaction(
        @Request() req: any,
        @Param("id", ParseUUIDPipe) cardId: string,
        @Body("amount") amount: number,
        @Body("description") description?: string
    ): Promise<void> {
        const userId = req.user.id;
        return this.creditCardsService.addTransaction(userId, cardId, amount, description);
    }

    @Post(":id/pay")
    @UseGuards(PermissionGuard(Permission.TRANSACTION_CREATE))
    @ApiOperation({ summary: "Realizar pagamento da fatura" })
    @ApiResponse({ status: 201, description: "Pagamento realizado com sucesso" })
    @ApiResponse({ status: 400, description: "Valor excede saldo atual" })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async payBill(
        @Request() req: any,
        @Param("id", ParseUUIDPipe) cardId: string,
        @Body("amount") amount: number
    ): Promise<void> {
        const userId = req.user.id;
        return this.creditCardsService.payBill(userId, cardId, amount);
    }

    // ===== UTILITY ENDPOINTS =====

    @Put(":id/set-default")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_UPDATE))
    @ApiOperation({ summary: "Definir cartão como padrão" })
    @ApiResponse({ status: 200, description: "Cartão definido como padrão" })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async setDefaultCard(@Request() req: any, @Param("id", ParseUUIDPipe) cardId: string): Promise<void> {
        const userId = req.user.id;
        return this.creditCardsService.setDefaultCard(userId, cardId);
    }

    @Put(":id/limits")
    @UseGuards(PermissionGuard(Permission.ACCOUNT_UPDATE))
    @ApiOperation({ summary: "Atualizar limite do cartão" })
    @ApiResponse({ status: 200, description: "Limite atualizado com sucesso" })
    @ApiResponse({ status: 404, description: "Cartão não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async updateLimits(
        @Request() req: any,
        @Param("id", ParseUUIDPipe) cardId: string,
        @Body("creditLimit") creditLimit: number
    ): Promise<void> {
        const userId = req.user.id;
        return this.creditCardsService.updateLimits(userId, cardId, creditLimit);
    }
}
