import { Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { UserPreferences } from "./entities/user-preferences.entity";
import { CreateOrganizationDto, UpdateOrganizationDto, UploadLogoDto } from "./dto/organization.dto";
import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from "./dto/user-preferences.dto";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class OrganizationsService {
    private readonly logger = new Logger(OrganizationsService.name);
    private readonly uploadDir = path.join(process.cwd(), 'uploads', 'logos');

    constructor(
        @InjectRepository(Organization)
        private organizationRepository: Repository<Organization>,
        @InjectRepository(UserPreferences)
        private userPreferencesRepository: Repository<UserPreferences>,
    ) {
        this.ensureUploadDir();
    }

    private ensureUploadDir() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            this.logger.log(`Diretório de upload criado: ${this.uploadDir}`);
        }
    }

    // ===== ORGANIZATION METHODS =====

    async create(userId: string, createDto: CreateOrganizationDto): Promise<Organization> {
        try {
            // Verificar se já existe uma organização para o usuário
            const existingOrg = await this.organizationRepository.findOne({
                where: { userId, isActive: true }
            });

            if (existingOrg) {
                throw new BadRequestException("Usuário já possui uma organização ativa");
            }

            const organization = this.organizationRepository.create({
                userId,
                ...createDto,
                isActive: true
            });

            const savedOrganization = await this.organizationRepository.save(organization);
            this.logger.log(`Organização criada: ${savedOrganization.id} para usuário ${userId}`);

            return savedOrganization;
        } catch (error) {
            this.logger.error(`Erro ao criar organização para usuário ${userId}:`, error);
            throw error;
        }
    }

    async findOne(userId: string): Promise<Organization> {
        const organization = await this.organizationRepository.findOne({
            where: { userId, isActive: true }
        });

        if (!organization) {
            throw new NotFoundException("Organização não encontrada");
        }

        return organization;
    }

    async update(userId: string, updateDto: UpdateOrganizationDto): Promise<Organization> {
        const organization = await this.findOne(userId);

        Object.assign(organization, updateDto);
        const updatedOrganization = await this.organizationRepository.save(organization);

        this.logger.log(`Organização atualizada: ${updatedOrganization.id} para usuário ${userId}`);
        return updatedOrganization;
    }

    async remove(userId: string): Promise<void> {
        const organization = await this.findOne(userId);

        // Soft delete - marcar como inativo
        organization.isActive = false;
        await this.organizationRepository.save(organization);

        this.logger.log(`Organização removida (soft delete): ${organization.id} para usuário ${userId}`);
    }

    async uploadLogo(userId: string, uploadDto: UploadLogoDto): Promise<{ logoUrl: string }> {
        try {
            const organization = await this.findOne(userId);

            // Validar se é uma imagem base64 válida
            const base64Data = uploadDto.logoBase64;
            if (!base64Data.startsWith('data:image/')) {
                throw new BadRequestException("Formato de imagem inválido. Use base64 com prefixo data:image/");
            }

            // Extrair tipo e dados da imagem
            const matches = base64Data.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
            if (!matches) {
                throw new BadRequestException("Formato base64 inválido");
            }

            const imageType = matches[1];
            const imageData = matches[2];

            // Validar tipo de imagem
            const allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
            if (!allowedTypes.includes(imageType.toLowerCase())) {
                throw new BadRequestException(`Tipo de imagem não suportado. Use: ${allowedTypes.join(', ')}`);
            }

            // Converter base64 para buffer
            const buffer = Buffer.from(imageData, 'base64');

            // Validar tamanho (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (buffer.length > maxSize) {
                throw new BadRequestException("Imagem muito grande. Máximo permitido: 5MB");
            }

            // Gerar nome único para o arquivo
            const fileName = uploadDto.fileName || `logo-${organization.id}`;
            const timestamp = Date.now();
            const hash = crypto.createHash('md5').update(buffer).digest('hex').substring(0, 8);
            const finalFileName = `${fileName}-${timestamp}-${hash}.${imageType}`;
            const filePath = path.join(this.uploadDir, finalFileName);

            // Salvar arquivo localmente
            fs.writeFileSync(filePath, buffer);

            // Gerar URL de acesso (assumindo que há um servidor estático configurado)
            const logoUrl = `/uploads/logos/${finalFileName}`;

            // Remover logo anterior se existir
            if (organization.logoPath) {
                const oldFilePath = path.join(this.uploadDir, path.basename(organization.logoPath));
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Atualizar organização com nova logo
            organization.logo = logoUrl;
            organization.logoPath = `/uploads/logos/${finalFileName}`;
            await this.organizationRepository.save(organization);

            this.logger.log(`Logo uploadada com sucesso para organização ${organization.id}: ${logoUrl}`);

            return { logoUrl };
        } catch (error) {
            this.logger.error(`Erro ao fazer upload da logo para usuário ${userId}:`, error);
            throw error;
        }
    }

    async deleteLogo(userId: string): Promise<void> {
        try {
            const organization = await this.findOne(userId);

            if (!organization.logoPath) {
                throw new NotFoundException("Logo não encontrada");
            }

            // Deletar arquivo local
            const filePath = path.join(this.uploadDir, path.basename(organization.logoPath));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            // Atualizar organização
            organization.logo = null;
            organization.logoPath = null;
            await this.organizationRepository.save(organization);

            this.logger.log(`Logo removida com sucesso para organização ${organization.id}`);
        } catch (error) {
            this.logger.error(`Erro ao remover logo para usuário ${userId}:`, error);
            throw error;
        }
    }

    // ===== USER PREFERENCES METHODS =====

    async createPreferences(userId: string, createDto: CreateUserPreferencesDto): Promise<UserPreferences> {
        try {
            // Verificar se já existem preferências para o usuário
            const existingPreferences = await this.userPreferencesRepository.findOne({
                where: { userId }
            });

            if (existingPreferences) {
                throw new BadRequestException("Usuário já possui preferências configuradas");
            }

            const preferences = this.userPreferencesRepository.create({
                userId,
                ...createDto
            });

            const savedPreferences = await this.userPreferencesRepository.save(preferences);
            this.logger.log(`Preferências criadas para usuário ${userId}`);

            return savedPreferences;
        } catch (error) {
            this.logger.error(`Erro ao criar preferências para usuário ${userId}:`, error);
            throw error;
        }
    }

    async findPreferences(userId: string): Promise<UserPreferences> {
        let preferences = await this.userPreferencesRepository.findOne({
            where: { userId }
        });

        if (!preferences) {
            // Criar preferências padrão se não existirem
            preferences = await this.createPreferences(userId, {});
        }

        return preferences;
    }

    async updatePreferences(userId: string, updateDto: UpdateUserPreferencesDto): Promise<UserPreferences> {
        const preferences = await this.findPreferences(userId);

        Object.assign(preferences, updateDto);
        const updatedPreferences = await this.userPreferencesRepository.save(preferences);

        this.logger.log(`Preferências atualizadas para usuário ${userId}`);
        return updatedPreferences;
    }

    async resetPreferences(userId: string): Promise<UserPreferences> {
        const preferences = await this.findPreferences(userId);

        // Resetar para valores padrão
        preferences.orderType = "crescente";
        preferences.defaultPeriod = "mensal";
        preferences.defaultCurrency = "brl";
        preferences.emailNotifications = true;
        preferences.pushNotifications = true;
        preferences.smsNotifications = true;
        preferences.dashboardWidgets = [];
        preferences.dashboardLayout = "grid";
        preferences.itemsPerPage = 20;
        preferences.defaultReportFormat = "pdf";
        preferences.includeCharts = true;
        preferences.includeDetails = true;
        preferences.autoBackup = true;
        preferences.backupRetentionDays = 7;
        preferences.backupFrequency = "daily";
        preferences.sessionTimeout = 30;
        preferences.twoFactorAuth = true;
        preferences.loginNotifications = true;
        preferences.notificationSettings = {
            transactionCreated: true,
            transactionUpdated: true,
            budgetExceeded: true,
            paymentDue: true,
            reportGenerated: true,
            systemMaintenance: true
        };
        preferences.integrationSettings = {};

        const resetPreferences = await this.userPreferencesRepository.save(preferences);
        this.logger.log(`Preferências resetadas para usuário ${userId}`);

        return resetPreferences;
    }

    // ===== UTILITY METHODS =====

    async getOrganizationSummary(userId: string): Promise<any> {
        const organization = await this.findOne(userId);
        const preferences = await this.findPreferences(userId);

        return {
            organization: {
                id: organization.id,
                name: organization.name,
                organizationType: organization.organizationType,
                logo: organization.logo,
                primaryColor: organization.primaryColor,
                currency: organization.currency,
                language: organization.language,
                timezone: organization.timezone,
                dateFormat: organization.dateFormat,
                fiscalPeriod: organization.fiscalPeriod,
                notifications: organization.notifications,
                isActive: organization.isActive
            },
            preferences: {
                orderType: preferences.orderType,
                defaultPeriod: preferences.defaultPeriod,
                defaultCurrency: preferences.defaultCurrency,
                dashboardLayout: preferences.dashboardLayout,
                itemsPerPage: preferences.itemsPerPage,
                emailNotifications: preferences.emailNotifications,
                pushNotifications: preferences.pushNotifications,
                smsNotifications: preferences.smsNotifications
            }
        };
    }

    async validateOrganizationData(data: any): Promise<boolean> {
        // Validar dados obrigatórios
        if (!data.name || data.name.trim().length === 0) {
            throw new BadRequestException("Nome da organização é obrigatório");
        }

        if (!data.organizationType) {
            throw new BadRequestException("Tipo da organização é obrigatório");
        }

        const validTypes = ['igreja', 'ministerio', 'ong', 'fundacao', 'outro'];
        if (!validTypes.includes(data.organizationType)) {
            throw new BadRequestException(`Tipo de organização inválido. Use: ${validTypes.join(', ')}`);
        }

        // Validar email se fornecido
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new BadRequestException("Email inválido");
            }
        }

        // Validar telefone se fornecido
        if (data.phone) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(data.phone)) {
                throw new BadRequestException("Formato de telefone inválido");
            }
        }

        return true;
    }
}
