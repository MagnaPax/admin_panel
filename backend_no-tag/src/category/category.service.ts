import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { Intermediate } from 'src/intermediate.entity';
import { CreateIntermediateDto } from '../create-intermediate.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
  ) {}

  async add(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // 카테고리 추가
    const category = await this.categoryRepository.save(createCategoryDto);

    // 중간 테이블 업데이트
    const createIntermediateDto: CreateIntermediateDto = {
      category_id: category.category_id,
    };
    await this.intermediateRepository.save(createIntermediateDto);

    return category;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async lookUp(
    categoryName: string[],
    product: boolean,
    brand: boolean,
  ): Promise<any> {
    let query = await this.categoryRepository.createQueryBuilder('category');

    if (categoryName && categoryName.length > 0) {
      query = query.where('category.category_name IN (:categoryName)', {
        categoryName,
      });
    }

    if (product) {
      query = query.leftJoinAndSelect('category.products', 'product');
    }

    if (brand) {
      query = query.leftJoinAndSelect('category.brands', 'brand');
    }

    return query.getMany();
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
