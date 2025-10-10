import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto, UpdateCategoryDto, CategoryResponseDto, ImportCategoriesDto, ExportCategoriesDto } from "./dto/category.dto";

export enum CategoryType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
  OTHER = "other"
}

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  // ===== CRUD METHODS =====

  async create(userId: string, createDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      // Verificar se categoria já existe
      const existingCategory = await this.categoryRepository.findOne({
        where: {
          userId,
          name: createDto.name,
          type: createDto.type,
          isActive: true
        }
      });

      if (existingCategory) {
        throw new ConflictException("Categoria já existe");
      }

      const category = this.categoryRepository.create({
        ...createDto,
        userId
      });

      const savedCategory = await this.categoryRepository.save(category);

      this.logger.log(`Categoria criada: ${savedCategory.id} - ${savedCategory.name}`);

      return this.mapCategoryToResponse(savedCategory);
    } catch (error) {
      this.logger.error(`Erro ao criar categoria:`, error);
      throw error;
    }
  }

  async findAll(userId: string, type?: CategoryType, search?: string): Promise<CategoryResponseDto[]> {
    try {
      const queryBuilder = this.categoryRepository
        .createQueryBuilder('category')
        .where('category.userId = :userId', { userId })
        .andWhere('category.isActive = :isActive', { isActive: true })
        .orderBy('category.type', 'ASC')
        .addOrderBy('category.name', 'ASC');

      if (type) {
        queryBuilder.andWhere('category.type = :type', { type });
      }

      if (search) {
        queryBuilder.andWhere(
          '(category.name ILIKE :search OR category.description ILIKE :search)',
          { search: `%${search}%` }
        );
      }

      const categories = await queryBuilder.getMany();

      console.log('🔍 BACKEND SERVICE - Categorias encontradas:', categories.length);
      if (categories.length > 0) {
        console.log('🔍 BACKEND SERVICE - Primeira categoria:', categories[0]);
        console.log('🔍 BACKEND SERVICE - IDs das categorias:', categories.map(cat => cat.id));
      }

      const mappedCategories = categories.map(category => this.mapCategoryToResponse(category));
      console.log('🔍 BACKEND SERVICE - Categorias mapeadas:', mappedCategories.length);
      if (mappedCategories.length > 0) {
        console.log('🔍 BACKEND SERVICE - Primeira categoria mapeada:', mappedCategories[0]);
      }

      return mappedCategories;
    } catch (error) {
      this.logger.error(`Erro ao buscar categorias:`, error);
      throw error;
    }
  }

  async findOne(userId: string, id: string): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id, userId, isActive: true }
      });

      if (!category) {
        throw new NotFoundException("Categoria não encontrada");
      }

      return this.mapCategoryToResponse(category);
    } catch (error) {
      this.logger.error(`Erro ao buscar categoria ${id}:`, error);
      throw error;
    }
  }

  async update(userId: string, id: string, updateDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id, userId, isActive: true }
      });

      if (!category) {
        throw new NotFoundException("Categoria não encontrada");
      }

      // Verificar se novo nome já existe (se foi alterado)
      if (updateDto.name && updateDto.name !== category.name) {
        const existingCategory = await this.categoryRepository.findOne({
          where: {
            userId,
            name: updateDto.name,
            type: updateDto.type || category.type,
            isActive: true
          }
        });

        if (existingCategory) {
          throw new ConflictException("Nome da categoria já existe");
        }
      }

      Object.assign(category, updateDto);
      const savedCategory = await this.categoryRepository.save(category);

      this.logger.log(`Categoria atualizada: ${savedCategory.id}`);

      return this.mapCategoryToResponse(savedCategory);
    } catch (error) {
      this.logger.error(`Erro ao atualizar categoria ${id}:`, error);
      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id, userId, isActive: true }
      });

      if (!category) {
        throw new NotFoundException("Categoria não encontrada");
      }

      // Verificar se categoria está sendo usada em transações
      // Aqui seria uma verificação com a tabela de transações
      // Por enquanto, apenas soft delete
      category.isActive = false;
      await this.categoryRepository.save(category);

      this.logger.log(`Categoria removida (soft delete): ${category.id}`);
    } catch (error) {
      this.logger.error(`Erro ao remover categoria ${id}:`, error);
      throw error;
    }
  }

  // ===== BULK OPERATIONS =====

  async createMultiple(userId: string, categories: CreateCategoryDto[]): Promise<CategoryResponseDto[]> {
    try {
      const createdCategories: Category[] = [];

      for (const categoryData of categories) {
        // Verificar se categoria já existe
        const existingCategory = await this.categoryRepository.findOne({
          where: {
            userId,
            name: categoryData.name,
            type: categoryData.type,
            isActive: true
          }
        });

        if (!existingCategory) {
          const category = this.categoryRepository.create({
            ...categoryData,
            userId
          });
          createdCategories.push(category);
        }
      }

      const savedCategories = await this.categoryRepository.save(createdCategories);

      this.logger.log(`${savedCategories.length} categorias criadas em lote`);

      return savedCategories.map(category => this.mapCategoryToResponse(category));
    } catch (error) {
      this.logger.error(`Erro ao criar categorias em lote:`, error);
      throw error;
    }
  }

  async updateMultiple(userId: string, updates: Array<{ id: string; data: UpdateCategoryDto }>): Promise<CategoryResponseDto[]> {
    try {
      const updatedCategories: CategoryResponseDto[] = [];

      for (const update of updates) {
        try {
          const updatedCategory = await this.update(userId, update.id, update.data);
          updatedCategories.push(updatedCategory);
        } catch (error) {
          this.logger.warn(`Erro ao atualizar categoria ${update.id}:`, error);
        }
      }

      this.logger.log(`${updatedCategories.length} categorias atualizadas em lote`);

      return updatedCategories;
    } catch (error) {
      this.logger.error(`Erro ao atualizar categorias em lote:`, error);
      throw error;
    }
  }

  async removeMultiple(userId: string, ids: string[]): Promise<void> {
    try {
      await this.categoryRepository.update(
        { id: In(ids), userId, isActive: true },
        { isActive: false }
      );

      this.logger.log(`${ids.length} categorias removidas em lote`);
    } catch (error) {
      this.logger.error(`Erro ao remover categorias em lote:`, error);
      throw error;
    }
  }

  // ===== IMPORT/EXPORT =====

  async exportCategories(userId: string, type?: CategoryType): Promise<ExportCategoriesDto> {
    try {
      const categories = await this.findAll(userId, type);

      const exportData: ExportCategoriesDto = {
        exportedAt: new Date(),
        totalCategories: categories.length,
        type: type || 'all',
        categories: categories.map(category => ({
          name: category.name,
          description: category.description,
          type: category.type,
          color: category.color,
          icon: category.icon,
          isDefault: category.isDefault
        }))
      };

      this.logger.log(`Categorias exportadas: ${categories.length}`);

      return exportData;
    } catch (error) {
      this.logger.error(`Erro ao exportar categorias:`, error);
      throw error;
    }
  }

  async importCategories(userId: string, importData: ImportCategoriesDto): Promise<{ created: number, skipped: number, errors: string[] }> {
    try {
      let created = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const categoryData of importData.categories) {
        try {
          // Verificar se categoria já existe
          const existingCategory = await this.categoryRepository.findOne({
            where: {
              userId,
              name: categoryData.name,
              type: categoryData.type,
              isActive: true
            }
          });

          if (existingCategory) {
            skipped++;
            continue;
          }

          const category = this.categoryRepository.create({
            ...categoryData,
            userId
          });

          await this.categoryRepository.save(category);
          created++;
        } catch (error) {
          errors.push(`Erro ao importar categoria "${categoryData.name}": ${error.message}`);
        }
      }

      this.logger.log(`Importação concluída: ${created} criadas, ${skipped} ignoradas, ${errors.length} erros`);

      return { created, skipped, errors };
    } catch (error) {
      this.logger.error(`Erro ao importar categorias:`, error);
      throw error;
    }
  }

  // ===== STATISTICS =====

  async getCategoryStats(userId: string): Promise<{
    total: number;
    byType: Record<CategoryType, number>;
    recentlyCreated: number;
    recentlyUpdated: number;
  }> {
    try {
      const total = await this.categoryRepository.count({
        where: { userId, isActive: true }
      });

      const byType = {
        [CategoryType.INCOME]: 0,
        [CategoryType.EXPENSE]: 0,
        [CategoryType.TRANSFER]: 0,
        [CategoryType.OTHER]: 0
      };

      for (const type of Object.values(CategoryType)) {
        byType[type] = await this.categoryRepository.count({
          where: { userId, type, isActive: true }
        });
      }

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentlyCreated = await this.categoryRepository.count({
        where: {
          userId,
          isActive: true,
          createdAt: { $gte: oneWeekAgo } as any
        }
      });

      const recentlyUpdated = await this.categoryRepository.count({
        where: {
          userId,
          isActive: true,
          updatedAt: { $gte: oneWeekAgo } as any
        }
      });

      return {
        total,
        byType,
        recentlyCreated,
        recentlyUpdated
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar estatísticas de categorias:`, error);
      throw error;
    }
  }

  // ===== DEFAULT CATEGORIES =====

  async createDefaultCategories(userId: string): Promise<CategoryResponseDto[]> {
    try {
      const defaultCategories = [
        // Receitas
        { name: "Dízimos", description: "Dízimos recebidos", type: CategoryType.INCOME, color: "#10B981", icon: "💰" },
        { name: "Ofertas", description: "Ofertas especiais", type: CategoryType.INCOME, color: "#059669", icon: "🎁" },
        { name: "Eventos", description: "Receitas de eventos", type: CategoryType.INCOME, color: "#047857", icon: "🎉" },
        { name: "Doações", description: "Doações diversas", type: CategoryType.INCOME, color: "#065F46", icon: "❤️" },

        // Despesas
        { name: "Salários", description: "Salários e benefícios", type: CategoryType.EXPENSE, color: "#EF4444", icon: "👥" },
        { name: "Manutenção", description: "Manutenção do templo", type: CategoryType.EXPENSE, color: "#DC2626", icon: "🔧" },
        { name: "Energia", description: "Contas de energia", type: CategoryType.EXPENSE, color: "#B91C1C", icon: "⚡" },
        { name: "Água", description: "Contas de água", type: CategoryType.EXPENSE, color: "#991B1B", icon: "💧" },
        { name: "Internet", description: "Internet e telefone", type: CategoryType.EXPENSE, color: "#7F1D1D", icon: "📶" },
        { name: "Marketing", description: "Marketing e divulgação", type: CategoryType.EXPENSE, color: "#F59E0B", icon: "📢" },
        { name: "Eventos", description: "Custos de eventos", type: CategoryType.EXPENSE, color: "#D97706", icon: "🎪" },
        { name: "Outros", description: "Outras despesas", type: CategoryType.EXPENSE, color: "#92400E", icon: "📦" }
      ];

      const createdCategories = await this.createMultiple(userId, defaultCategories);

      this.logger.log(`${createdCategories.length} categorias padrão criadas para usuário ${userId}`);

      return createdCategories;
    } catch (error) {
      this.logger.error(`Erro ao criar categorias padrão:`, error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  private mapCategoryToResponse(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isDefault: category.isDefault,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  }
} 