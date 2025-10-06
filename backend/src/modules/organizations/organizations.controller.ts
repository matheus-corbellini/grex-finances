import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { OrganizationsService } from "./organizations.service";
import {
    CreateOrganizationDto,
    UpdateOrganizationDto,
    UploadLogoDto
} from "./dto/organization.dto";
import {
    CreateUserPreferencesDto,
    UpdateUserPreferencesDto
} from "./dto/user-preferences.dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@ApiTags('Organizations')
@Controller("organizations")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    // ===== ORGANIZATION ENDPOINTS =====

    @Post()
    @ApiOperation({ summary: 'Criar nova organização' })
    @ApiResponse({ status: 201, description: 'Organização criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou organização já existe' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Request() req: any, @Body() createDto: CreateOrganizationDto) {
        const userId = req.user.id;

        // Validar dados antes de criar
        await this.organizationsService.validateOrganizationData(createDto);

        return this.organizationsService.create(userId, createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obter organização do usuário' })
    @ApiResponse({ status: 200, description: 'Organização encontrada' })
    @ApiResponse({ status: 404, description: 'Organização não encontrada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findOne(@Request() req: any) {
        const userId = req.user.id;
        return this.organizationsService.findOne(userId);
    }

    @Put()
    @ApiOperation({ summary: 'Atualizar organização' })
    @ApiResponse({ status: 200, description: 'Organização atualizada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Organização não encontrada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async update(@Request() req: any, @Body() updateDto: UpdateOrganizationDto) {
        const userId = req.user.id;

        // Validar dados antes de atualizar
        await this.organizationsService.validateOrganizationData(updateDto);

        return this.organizationsService.update(userId, updateDto);
    }

    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover organização' })
    @ApiResponse({ status: 204, description: 'Organização removida com sucesso' })
    @ApiResponse({ status: 404, description: 'Organização não encontrada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async remove(@Request() req: any) {
        const userId = req.user.id;
        await this.organizationsService.remove(userId);
    }

    @Post('logo')
    @ApiOperation({ summary: 'Upload de logo da organização via base64' })
    @ApiResponse({ status: 201, description: 'Logo uploadada com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Organização não encontrada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async uploadLogo(@Request() req: any, @Body() uploadDto: UploadLogoDto) {
        const userId = req.user.id;
        return this.organizationsService.uploadLogo(userId, uploadDto);
    }

    @Delete('logo')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remover logo da organização' })
    @ApiResponse({ status: 204, description: 'Logo removida com sucesso' })
    @ApiResponse({ status: 404, description: 'Logo não encontrada' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async deleteLogo(@Request() req: any) {
        const userId = req.user.id;
        await this.organizationsService.deleteLogo(userId);
    }

    // ===== USER PREFERENCES ENDPOINTS =====

    @Post('preferences')
    @ApiOperation({ summary: 'Criar preferências do usuário' })
    @ApiResponse({ status: 201, description: 'Preferências criadas com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou preferências já existem' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async createPreferences(@Request() req: any, @Body() createDto: CreateUserPreferencesDto) {
        const userId = req.user.id;
        return this.organizationsService.createPreferences(userId, createDto);
    }

    @Get('preferences')
    @ApiOperation({ summary: 'Obter preferências do usuário' })
    @ApiResponse({ status: 200, description: 'Preferências encontradas' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findPreferences(@Request() req: any) {
        const userId = req.user.id;
        return this.organizationsService.findPreferences(userId);
    }

    @Put('preferences')
    @ApiOperation({ summary: 'Atualizar preferências do usuário' })
    @ApiResponse({ status: 200, description: 'Preferências atualizadas com sucesso' })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async updatePreferences(@Request() req: any, @Body() updateDto: UpdateUserPreferencesDto) {
        const userId = req.user.id;
        return this.organizationsService.updatePreferences(userId, updateDto);
    }

    @Post('preferences/reset')
    @ApiOperation({ summary: 'Resetar preferências para padrão' })
    @ApiResponse({ status: 200, description: 'Preferências resetadas com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async resetPreferences(@Request() req: any) {
        const userId = req.user.id;
        return this.organizationsService.resetPreferences(userId);
    }

    // ===== UTILITY ENDPOINTS =====

    @Get('summary')
    @ApiOperation({ summary: 'Obter resumo da organização e preferências' })
    @ApiResponse({ status: 200, description: 'Resumo obtido com sucesso' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async getSummary(@Request() req: any) {
        const userId = req.user.id;
        return this.organizationsService.getOrganizationSummary(userId);
    }
}
