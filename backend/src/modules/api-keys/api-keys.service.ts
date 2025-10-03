import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiKey } from "./entities/api-key.entity";
import { CreateApiKeyDto, UpdateApiKeyDto, ApiKeyFiltersDto } from "./dto/api-key.dto";
import * as crypto from "crypto";

@Injectable()
export class ApiKeysService {
    constructor(
        @InjectRepository(ApiKey)
        private readonly apiKeyRepository: Repository<ApiKey>,
    ) { }

    async create(userId: string, createDto: CreateApiKeyDto): Promise<{ apiKey: ApiKey; plainKey: string }> {
        // Gerar chave API única
        const plainKey = this.generateApiKey();
        const keyHash = this.hashApiKey(plainKey);

        // Verificar se já existe uma chave com o mesmo hash (muito improvável)
        const existingKey = await this.apiKeyRepository.findOne({
            where: { keyHash }
        });

        if (existingKey) {
            throw new BadRequestException("Erro ao gerar chave API. Tente novamente.");
        }

        const apiKey = this.apiKeyRepository.create({
            userId,
            keyHash,
            name: createDto.name,
            description: createDto.description,
            expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : null,
            permissions: createDto.permissions || {
                contacts: true,
                transactions: true,
                webhooks: false
            },
            allowedIps: createDto.allowedIps || [],
        });

        const savedApiKey = await this.apiKeyRepository.save(apiKey);

        return {
            apiKey: savedApiKey,
            plainKey // Retornar a chave em texto plano apenas na criação
        };
    }

    async findAll(userId: string, filters?: ApiKeyFiltersDto): Promise<ApiKey[]> {
        const query = this.apiKeyRepository.createQueryBuilder("apiKey")
            .where("apiKey.userId = :userId", { userId });

        if (filters?.isActive !== undefined) {
            query.andWhere("apiKey.isActive = :isActive", { isActive: filters.isActive });
        }

        if (filters?.name) {
            query.andWhere("apiKey.name ILIKE :name", { name: `%${filters.name}%` });
        }

        return query.orderBy("apiKey.createdAt", "DESC").getMany();
    }

    async findOne(userId: string, id: string): Promise<ApiKey> {
        const apiKey = await this.apiKeyRepository.findOne({
            where: { id, userId }
        });

        if (!apiKey) {
            throw new NotFoundException("Chave API não encontrada");
        }

        return apiKey;
    }

    async update(userId: string, id: string, updateDto: UpdateApiKeyDto): Promise<ApiKey> {
        const apiKey = await this.findOne(userId, id);

        Object.assign(apiKey, {
            ...updateDto,
            expiresAt: updateDto.expiresAt ? new Date(updateDto.expiresAt) : apiKey.expiresAt
        });

        return this.apiKeyRepository.save(apiKey);
    }

    async remove(userId: string, id: string): Promise<void> {
        const apiKey = await this.findOne(userId, id);
        await this.apiKeyRepository.remove(apiKey);
    }

    async validateApiKey(apiKey: string, requiredPermission?: string, clientIp?: string): Promise<ApiKey> {
        const keyHash = this.hashApiKey(apiKey);

        const apiKeyEntity = await this.apiKeyRepository.findOne({
            where: { keyHash, isActive: true }
        });

        if (!apiKeyEntity) {
            throw new UnauthorizedException("Chave API inválida");
        }

        // Verificar expiração
        if (apiKeyEntity.expiresAt && apiKeyEntity.expiresAt < new Date()) {
            throw new UnauthorizedException("Chave API expirada");
        }

        // Verificar IP permitido
        if (apiKeyEntity.allowedIps.length > 0 && clientIp) {
            const isIpAllowed = apiKeyEntity.allowedIps.some(allowedIp => {
                // Suporte básico para CIDR (simplificado)
                if (allowedIp.includes('/')) {
                    // Implementação básica de verificação CIDR
                    return this.isIpInCidr(clientIp, allowedIp);
                }
                return clientIp === allowedIp;
            });

            if (!isIpAllowed) {
                throw new UnauthorizedException("IP não autorizado para esta chave API");
            }
        }

        // Verificar permissão específica
        if (requiredPermission && !apiKeyEntity.permissions[requiredPermission]) {
            throw new UnauthorizedException(`Permissão '${requiredPermission}' não concedida para esta chave API`);
        }

        // Atualizar estatísticas de uso
        await this.updateUsageStats(apiKeyEntity.id);

        return apiKeyEntity;
    }

    private generateApiKey(): string {
        // Gerar chave no formato: gfx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        const randomBytes = crypto.randomBytes(32);
        return `gfx_${randomBytes.toString('hex')}`;
    }

    private hashApiKey(apiKey: string): string {
        return crypto.createHash('sha256').update(apiKey).digest('hex');
    }

    private async updateUsageStats(apiKeyId: string): Promise<void> {
        await this.apiKeyRepository.update(apiKeyId, {
            usageCount: () => "usage_count + 1",
            lastUsedAt: new Date()
        });
    }

    private isIpInCidr(ip: string, cidr: string): boolean {
        // Implementação básica de verificação CIDR
        // Para produção, considere usar uma biblioteca especializada
        const [network, prefixLength] = cidr.split('/');
        const ipNum = this.ipToNumber(ip);
        const networkNum = this.ipToNumber(network);
        const mask = (0xffffffff << (32 - parseInt(prefixLength))) >>> 0;

        return (ipNum & mask) === (networkNum & mask);
    }

    private ipToNumber(ip: string): number {
        return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
    }
}
