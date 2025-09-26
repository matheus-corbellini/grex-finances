import { Controller, Get } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Get()
  async findAll() {
    // Mock user para teste
    const userId = '18ceba90-1200-40e5-ac06-de32d18a15a5';
    return this.categoriesService.findAll(userId);
  }
} 