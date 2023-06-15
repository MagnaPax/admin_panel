import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(category_id: number) {
    return await this.categoryRepository.findOne({ where: { category_id } });
  }

  async update(category_id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(category_id);
    if (!category) {
      throw new Error('Not found the category');
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(category_id: number) {
    const category = await this.findOne(category_id);
    if (!category) {
      throw new Error('Not found the category');
    }
    return await this.categoryRepository.remove(category);
  }
}
