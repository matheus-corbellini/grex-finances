import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Webhook } from "./entities/webhook.entity";
import { WebhookLog } from "./entities/webhook-log.entity";
import { CreateWebhookDto, UpdateWebhookDto } from "./dto/webhook.dto";
import axios, { AxiosResponse } from "axios";
import * as crypto from "crypto";

@Injectable()
export class WebhooksService {
    private readonly logger = new Logger(WebhooksService.name);

    constructor(
        @InjectRepository(Webhook)
        private readonly webhookRepository: Repository<Webhook>,
        @InjectRepository(WebhookLog)
        private readonly webhookLogRepository: Repository<WebhookLog>,
    ) { }

    async create(userId: string, createDto: CreateWebhookDto): Promise<Webhook> {
        const webhook = this.webhookRepository.create({
            userId,
            ...createDto,
            events: createDto.events || []
        });

        return this.webhookRepository.save(webhook);
    }

    async findAll(userId: string): Promise<Webhook[]> {
        return this.webhookRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(userId: string, id: string): Promise<Webhook> {
        const webhook = await this.webhookRepository.findOne({
            where: { id, userId }
        });

        if (!webhook) {
            throw new NotFoundException('Webhook não encontrado');
        }

        return webhook;
    }

    async update(userId: string, id: string, updateDto: UpdateWebhookDto): Promise<Webhook> {
        const webhook = await this.findOne(userId, id);

        Object.assign(webhook, updateDto);
        return this.webhookRepository.save(webhook);
    }

    async remove(userId: string, id: string): Promise<void> {
        const webhook = await this.findOne(userId, id);
        await this.webhookRepository.remove(webhook);
    }

    async triggerWebhook(
        userId: string,
        event: string,
        payload: any,
        retryCount: number = 0
    ): Promise<void> {
        // Buscar webhooks ativos para o evento
        const webhooks = await this.webhookRepository.find({
            where: {
                userId,
                isActive: true,
                events: { $contains: [event] } as any // PostgreSQL array contains
            }
        });

        if (webhooks.length === 0) {
            this.logger.debug(`Nenhum webhook ativo encontrado para o evento: ${event}`);
            return;
        }

        this.logger.log(`Disparando ${webhooks.length} webhook(s) para o evento: ${event}`);

        // Disparar webhooks em paralelo
        const promises = webhooks.map(webhook =>
            this.sendWebhook(webhook, event, payload, retryCount)
        );

        await Promise.allSettled(promises);
    }

    private async sendWebhook(
        webhook: Webhook,
        event: string,
        payload: any,
        retryCount: number
    ): Promise<void> {
        const startTime = Date.now();
        let webhookLog: WebhookLog;

        try {
            // Preparar headers
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                'User-Agent': 'GrexFinances-Webhook/1.0',
                'X-Webhook-Event': event,
                'X-Webhook-Timestamp': new Date().toISOString(),
                ...webhook.headers
            };

            // Adicionar assinatura HMAC se secret estiver configurado
            if (webhook.secret) {
                const signature = this.generateHmacSignature(payload, webhook.secret);
                headers['X-Webhook-Signature'] = signature;
            }

            // Criar log antes do envio
            webhookLog = this.webhookLogRepository.create({
                webhookId: webhook.id,
                event,
                payload,
                url: webhook.url,
                headers,
                retryCount
            });

            // Enviar webhook
            const response: AxiosResponse = await axios.post(webhook.url, payload, {
                headers,
                timeout: 30000, // 30 segundos
                validateStatus: (status) => status < 500 // Aceitar 4xx como sucesso
            });

            const responseTime = Date.now() - startTime;

            // Atualizar log com sucesso
            webhookLog.statusCode = response.status;
            webhookLog.responseBody = response.data;
            webhookLog.responseTime = responseTime;
            webhookLog.isSuccess = true;

            // Atualizar estatísticas do webhook
            await this.updateWebhookStats(webhook.id, true);

            this.logger.log(`Webhook ${webhook.name} executado com sucesso (${responseTime}ms)`);

        } catch (error: any) {
            const responseTime = Date.now() - startTime;

            // Atualizar log com erro
            webhookLog.statusCode = error.response?.status;
            webhookLog.responseBody = error.response?.data;
            webhookLog.errorMessage = error.message;
            webhookLog.responseTime = responseTime;
            webhookLog.isSuccess = false;

            // Atualizar estatísticas do webhook
            await this.updateWebhookStats(webhook.id, false);

            this.logger.error(`Erro ao executar webhook ${webhook.name}: ${error.message}`);

            // Tentar novamente se não excedeu o limite de tentativas
            if (retryCount < 3) {
                this.logger.log(`Tentando novamente webhook ${webhook.name} (tentativa ${retryCount + 1})`);

                // Aguardar antes de tentar novamente (backoff exponencial)
                const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, delay));

                await this.sendWebhook(webhook, event, payload, retryCount + 1);
            }
        } finally {
            // Salvar log
            if (webhookLog) {
                await this.webhookLogRepository.save(webhookLog);
            }
        }
    }

    private async updateWebhookStats(webhookId: string, isSuccess: boolean): Promise<void> {
        const updateData: any = {
            lastTriggeredAt: new Date()
        };

        if (isSuccess) {
            updateData.successCount = () => "success_count + 1";
            updateData.lastSuccessAt = new Date();
        } else {
            updateData.failureCount = () => "failure_count + 1";
            updateData.lastFailureAt = new Date();
        }

        await this.webhookRepository.update(webhookId, updateData);
    }

    private generateHmacSignature(payload: any, secret: string): string {
        const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
        return crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
    }

    async getWebhookLogs(
        userId: string,
        webhookId?: string,
        limit: number = 50,
        offset: number = 0
    ): Promise<WebhookLog[]> {
        const query = this.webhookLogRepository.createQueryBuilder('log')
            .leftJoin('log.webhook', 'webhook')
            .where('webhook.userId = :userId', { userId })
            .orderBy('log.createdAt', 'DESC')
            .limit(limit)
            .offset(offset);

        if (webhookId) {
            query.andWhere('log.webhookId = :webhookId', { webhookId });
        }

        return query.getMany();
    }
}
