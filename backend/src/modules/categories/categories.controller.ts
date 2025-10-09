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
import { CategoriesService, CategoryType } from "./categories.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionGuard } from "../../common/guards/permission.guard";
import { Permission } from "../users/entities/role.entity";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  ImportCategoriesDto,
  ExportCategoriesDto,
  CategoryStatsDto
} from "./dto/category.dto";

@ApiTags("Categories")
@Controller("categories")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // ===== CRUD ENDPOINTS =====

  @Post()
  @UseGuards(PermissionGuard(Permission.CATEGORY_CREATE))
  @ApiOperation({ summary: "Criar nova categoria" })
  @ApiResponse({ status: 201, description: "Categoria criada com sucesso", type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Categoria já existe" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async create(@CurrentUser('id') userId: string, @Body() createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  // @UseGuards(PermissionGuard(Permission.CATEGORY_READ)) // Temporariamente desabilitado para teste
  @ApiOperation({ summary: "Listar categorias" })
  @ApiQuery({ name: "type", required: false, enum: CategoryType, description: "Filtrar por tipo" })
  @ApiQuery({ name: "search", required: false, type: String, description: "Buscar por nome ou descrição" })
  @ApiResponse({ status: 200, description: "Lista de categorias", type: [CategoryResponseDto] })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async findAll(
    @Request() req: any,
    @Query("type") type?: CategoryType,
    @Query("search") search?: string
  ): Promise<CategoryResponseDto[]> {
    // Mock user para teste
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5';
    return this.categoriesService.findAll(userId, type, search);
  }

  @Get(":id")
  @UseGuards(PermissionGuard(Permission.CATEGORY_READ))
  @ApiOperation({ summary: "Obter categoria por ID" })
  @ApiResponse({ status: 200, description: "Categoria encontrada", type: CategoryResponseDto })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async findOne(@Request() req: any, @Param("id", ParseUUIDPipe) id: string): Promise<CategoryResponseDto> {
    const userId = req.user.id;
    return this.categoriesService.findOne(userId, id);
  }

  @Put(":id")
  @UseGuards(PermissionGuard(Permission.CATEGORY_UPDATE))
  @ApiOperation({ summary: "Atualizar categoria" })
  @ApiResponse({ status: 200, description: "Categoria atualizada com sucesso", type: CategoryResponseDto })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  @ApiResponse({ status: 409, description: "Nome da categoria já existe" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async update(
    @Request() req: any,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    const userId = req.user.id;
    return this.categoriesService.update(userId, id, updateCategoryDto);
  }

  @Delete(":id")
  @UseGuards(PermissionGuard(Permission.CATEGORY_DELETE))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover categoria (soft delete)" })
  @ApiResponse({ status: 204, description: "Categoria removida com sucesso" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async remove(@Request() req: any, @Param("id", ParseUUIDPipe) id: string): Promise<void> {
    const userId = req.user.id;
    return this.categoriesService.remove(userId, id);
  }

  // ===== BULK OPERATIONS =====

  @Post("bulk")
  @UseGuards(PermissionGuard(Permission.CATEGORY_CREATE))
  @ApiOperation({ summary: "Criar múltiplas categorias" })
  @ApiResponse({ status: 201, description: "Categorias criadas com sucesso", type: [CategoryResponseDto] })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async createMultiple(
    @Request() req: any,
    @Body("categories") categories: CreateCategoryDto[]
  ): Promise<CategoryResponseDto[]> {
    const userId = req.user.id;
    return this.categoriesService.createMultiple(userId, categories);
  }

  @Put("bulk")
  @UseGuards(PermissionGuard(Permission.CATEGORY_UPDATE))
  @ApiOperation({ summary: "Atualizar múltiplas categorias" })
  @ApiResponse({ status: 200, description: "Categorias atualizadas com sucesso", type: [CategoryResponseDto] })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async updateMultiple(
    @Request() req: any,
    @Body("updates") updates: Array<{ id: string; data: UpdateCategoryDto }>
  ): Promise<CategoryResponseDto[]> {
    const userId = req.user.id;
    return this.categoriesService.updateMultiple(userId, updates);
  }

  @Delete("bulk")
  @UseGuards(PermissionGuard(Permission.CATEGORY_DELETE))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover múltiplas categorias" })
  @ApiResponse({ status: 204, description: "Categorias removidas com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async removeMultiple(@Request() req: any, @Body("ids") ids: string[]): Promise<void> {
    const userId = req.user.id;
    return this.categoriesService.removeMultiple(userId, ids);
  }

  // ===== IMPORT/EXPORT =====

  @Post("import")
  @UseGuards(PermissionGuard(Permission.CATEGORY_CREATE))
  @ApiOperation({ summary: "Importar categorias" })
  @ApiResponse({ status: 201, description: "Categorias importadas com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async importCategories(
    @Request() req: any,
    @Body() importData: ImportCategoriesDto
  ): Promise<{ created: number, skipped: number, errors: string[] }> {
    const userId = req.user.id;
    return this.categoriesService.importCategories(userId, importData);
  }

  @Get("export")
  @UseGuards(PermissionGuard(Permission.CATEGORY_READ))
  @ApiOperation({ summary: "Exportar categorias" })
  @ApiQuery({ name: "type", required: false, enum: CategoryType, description: "Filtrar por tipo" })
  @ApiResponse({ status: 200, description: "Categorias exportadas", type: ExportCategoriesDto })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async exportCategories(
    @Request() req: any,
    @Query("type") type?: CategoryType
  ): Promise<ExportCategoriesDto> {
    const userId = req.user.id;
    return this.categoriesService.exportCategories(userId, type);
  }

  // ===== STATISTICS =====

  @Get("stats")
  @UseGuards(PermissionGuard(Permission.CATEGORY_READ))
  @ApiOperation({ summary: "Obter estatísticas de categorias" })
  @ApiResponse({ status: 200, description: "Estatísticas de categorias", type: CategoryStatsDto })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async getStats(@Request() req: any): Promise<CategoryStatsDto> {
    const userId = req.user.id;
    return this.categoriesService.getCategoryStats(userId);
  }

  // ===== DEFAULT CATEGORIES =====

  @Post("default")
  @UseGuards(PermissionGuard(Permission.CATEGORY_CREATE))
  @ApiOperation({ summary: "Criar categorias padrão" })
  @ApiResponse({ status: 201, description: "Categorias padrão criadas com sucesso", type: [CategoryResponseDto] })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Sem permissão" })
  async createDefaultCategories(@Request() req: any): Promise<CategoryResponseDto[]> {
    const userId = req.user.id;
    return this.categoriesService.createDefaultCategories(userId);
  }
} 