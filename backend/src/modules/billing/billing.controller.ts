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
import { BillingService } from "./billing.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { Permission } from "../users/entities/role.entity";
import {
    CreatePlanDto,
    UpdatePlanDto,
    CreateSubscriptionDto,
    CreatePaymentDto,
    PlanResponseDto,
    SubscriptionResponseDto,
    PaymentResponseDto
} from "./dto/billing.dto";

@ApiTags("Billing")
@Controller("billing")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    // ===== PLAN ENDPOINTS =====

    @Post("plans")
    @UseGuards(PermissionGuard(Permission.BILLING_MANAGE))
    @ApiOperation({ summary: "Criar novo plano" })
    @ApiResponse({ status: 201, description: "Plano criado com sucesso", type: PlanResponseDto })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 409, description: "Plano já existe" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
        return this.billingService.createPlan(createPlanDto);
    }

    @Get("plans")
    @ApiOperation({ summary: "Listar planos disponíveis" })
    @ApiResponse({ status: 200, description: "Lista de planos", type: [PlanResponseDto] })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async findAllPlans(): Promise<PlanResponseDto[]> {
        return this.billingService.findAllPlans();
    }

    @Get("plans/:id")
    @ApiOperation({ summary: "Obter plano por ID" })
    @ApiResponse({ status: 200, description: "Plano encontrado", type: PlanResponseDto })
    @ApiResponse({ status: 404, description: "Plano não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async findOnePlan(@Param("id", ParseUUIDPipe) id: string): Promise<PlanResponseDto> {
        return this.billingService.findOnePlan(id);
    }

    @Put("plans/:id")
    @UseGuards(PermissionGuard(Permission.BILLING_MANAGE))
    @ApiOperation({ summary: "Atualizar plano" })
    @ApiResponse({ status: 200, description: "Plano atualizado com sucesso", type: PlanResponseDto })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Plano não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async updatePlan(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() updatePlanDto: UpdatePlanDto
    ): Promise<PlanResponseDto> {
        return this.billingService.updatePlan(id, updatePlanDto);
    }

    @Delete("plans/:id")
    @UseGuards(PermissionGuard(Permission.BILLING_MANAGE))
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: "Remover plano" })
    @ApiResponse({ status: 204, description: "Plano removido com sucesso" })
    @ApiResponse({ status: 400, description: "Plano com assinaturas ativas" })
    @ApiResponse({ status: 404, description: "Plano não encontrado" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    @ApiResponse({ status: 403, description: "Sem permissão" })
    async removePlan(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
        return this.billingService.removePlan(id);
    }

    // ===== SUBSCRIPTION ENDPOINTS =====

    @Post("subscriptions")
    @ApiOperation({ summary: "Criar nova assinatura" })
    @ApiResponse({ status: 201, description: "Assinatura criada com sucesso", type: SubscriptionResponseDto })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Plano não encontrado" })
    @ApiResponse({ status: 409, description: "Usuário já possui assinatura ativa" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async createSubscription(
        @Request() req: any,
        @Body() createSubscriptionDto: CreateSubscriptionDto
    ): Promise<SubscriptionResponseDto> {
        const userId = req.user.id;
        return this.billingService.createSubscription(userId, createSubscriptionDto);
    }

    @Get("subscriptions")
    @ApiOperation({ summary: "Obter assinatura do usuário" })
    @ApiResponse({ status: 200, description: "Assinatura encontrada", type: SubscriptionResponseDto })
    @ApiResponse({ status: 404, description: "Assinatura não encontrada" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async findUserSubscription(@Request() req: any): Promise<SubscriptionResponseDto | null> {
        const userId = req.user.id;
        return this.billingService.findUserSubscription(userId);
    }

    @Put("subscriptions/:id/cancel")
    @ApiOperation({ summary: "Cancelar assinatura" })
    @ApiResponse({ status: 200, description: "Assinatura cancelada com sucesso", type: SubscriptionResponseDto })
    @ApiResponse({ status: 404, description: "Assinatura não encontrada" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async cancelSubscription(
        @Param("id", ParseUUIDPipe) id: string,
        @Body("reason") reason?: string
    ): Promise<SubscriptionResponseDto> {
        return this.billingService.cancelSubscription(id, reason);
    }

    // ===== PAYMENT ENDPOINTS =====

    @Post("payments")
    @ApiOperation({ summary: "Criar novo pagamento" })
    @ApiResponse({ status: 201, description: "Pagamento criado com sucesso", type: PaymentResponseDto })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Assinatura não encontrada" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async createPayment(
        @Request() req: any,
        @Body() createPaymentDto: CreatePaymentDto
    ): Promise<PaymentResponseDto> {
        const userId = req.user.id;
        return this.billingService.createPayment(userId, createPaymentDto);
    }

    @Get("payments")
    @ApiOperation({ summary: "Listar pagamentos do usuário" })
    @ApiQuery({ name: "page", required: false, type: Number, description: "Página (padrão: 1)" })
    @ApiQuery({ name: "limit", required: false, type: Number, description: "Limite por página (padrão: 10)" })
    @ApiResponse({ status: 200, description: "Lista de pagamentos" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async findUserPayments(
        @Request() req: any,
        @Query("page") page?: number,
        @Query("limit") limit?: number
    ): Promise<{ payments: PaymentResponseDto[], total: number }> {
        const userId = req.user.id;
        return this.billingService.findUserPayments(userId, page || 1, limit || 10);
    }

    // ===== STRIPE INTEGRATION ENDPOINTS =====

    @Post("stripe/payment-intent")
    @ApiOperation({ summary: "Criar Payment Intent do Stripe" })
    @ApiResponse({ status: 201, description: "Payment Intent criado com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Assinatura não encontrada" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async createStripePaymentIntent(
        @Body("subscriptionId") subscriptionId: string
    ): Promise<{ clientSecret: string, paymentIntentId: string }> {
        return this.billingService.createStripePaymentIntent(subscriptionId);
    }

    @Post("stripe/webhook")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Webhook do Stripe" })
    @ApiResponse({ status: 200, description: "Webhook processado com sucesso" })
    async handleStripeWebhook(@Body() payload: any): Promise<void> {
        return this.billingService.handleStripeWebhook(payload);
    }

    // ===== MERCADO PAGO INTEGRATION ENDPOINTS =====

    @Post("mercado-pago/payment")
    @ApiOperation({ summary: "Criar pagamento Mercado Pago" })
    @ApiResponse({ status: 201, description: "Pagamento criado com sucesso" })
    @ApiResponse({ status: 400, description: "Dados inválidos" })
    @ApiResponse({ status: 404, description: "Assinatura não encontrada" })
    @ApiResponse({ status: 401, description: "Não autorizado" })
    async createMercadoPagoPayment(
        @Body("subscriptionId") subscriptionId: string
    ): Promise<{ qrCode: string, paymentId: string }> {
        return this.billingService.createMercadoPagoPayment(subscriptionId);
    }
}
