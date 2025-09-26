import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { userId, isActive: true },
      order: { name: 'ASC' }
    });
  }
} 