export interface Category {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  type: CategoryType;
  color: string;
  icon: string;
  isDefault: boolean;
  parentId?: string;
  subcategories?: Subcategory[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum CategoryType {
  INCOME = "income",
  EXPENSE = "expense",
  TRANSFER = "transfer",
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  type: CategoryType;
  color: string;
  icon: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  order?: number;
}

export interface CreateSubcategoryDto {
  categoryId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  subcategorySpending?: SubcategorySpending[];
}

export interface SubcategorySpending {
  subcategoryId: string;
  subcategoryName: string;
  amount: number;
  transactionCount: number;
  percentage: number;
}
