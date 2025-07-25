export * from "./user.types";
export * from "./account.types";
export * from "./transaction.types";
export * from "./category.types";
export * from "./budget.types";
export * from "./investment.types";
export * from "./goal.types";
export * from "./report.types";

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: Date;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterOptions {
  [key: string]: any;
}

export interface SearchOptions {
  query: string;
  fields?: string[];
}

export interface RequestOptions {
  page?: number;
  limit?: number;
  sort?: SortOptions;
  filter?: FilterOptions;
  search?: SearchOptions;
}
