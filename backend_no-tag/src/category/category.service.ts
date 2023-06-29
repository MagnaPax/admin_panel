import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'src/queryHelper';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateIntermediateDto } from 'src/create-intermediate.dto';

import { Category } from './entities/category.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Product } from 'src/product/entities/product.entity';
import { Intermediate } from 'src/intermediate.entity';

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

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
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
    const query = new Query();

    const categories = await query.findRecordsByValues(
      [`${category_id}`],
      ['category_id'],
      this.categoryRepository,
    );

    if (!categories) throw new Error('Not found the category');

    // Intermediate 엔티티 수정
    await this.intermediateRepository
      .createQueryBuilder()
      .update(Intermediate)
      .set({ category_id: null })
      .where('category_id = :CategoryID', { CategoryID: category_id })
      .execute();

    // Product 엔티티 수정
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ category_id: null })
      .where('category_id = :CategoryID', { CategoryID: category_id })
      .execute();

    // 값이 하나도 없는 중간 테이블 삭제
    const areEmpties = await query.findRecordsByValues(
      [null, null],
      ['brand_id', 'category_id'],
      this.intermediateRepository,
    );

    if (areEmpties) await this.intermediateRepository.remove(areEmpties);

    return await this.categoryRepository.remove(categories);
  }
}
