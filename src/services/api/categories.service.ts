import BaseApiService from "./base.service";

export interface Category {
  id: string;
  name: string;
  description?: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class CategoriesService extends BaseApiService {
  constructor() {
    super();
  }

  async getCategories(): Promise<Category[]> {
    try {
      console.log("🔍 CATEGORIES SERVICE - Chamando GET /categories");
      const result = await this.get<Category[]>("/categories");
      console.log("🔍 CATEGORIES SERVICE - Resultado recebido:", result);
      return result;
    } catch (error) {
      console.error("❌ CATEGORIES SERVICE - Erro ao buscar categorias:", error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.get<Category>(`/categories/${id}`);
  }

  async createCategory(category: Partial<Category>): Promise<Category> {
    return this.post<Category>("/categories", category);
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return this.put<Category>(`/categories/${id}`, category);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.delete(`/categories/${id}`);
  }
}

const categoriesService = new CategoriesService();
export default categoriesService;
