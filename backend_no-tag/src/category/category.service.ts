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
  private query = new Query();

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
    // 카테고리 이름이 중복되지 않게
    const isDuplicated = await this.query.findRecordsByValues(
      [`${createCategoryDto.category_name}`],
      ['category_name'],
      this.categoryRepository,
    );
    if (isDuplicated.length !== 0) throw new Error(`It's duplicated value`);

    // 카테고리 추가
    const newCategory = await this.categoryRepository.save(createCategoryDto);

    // 중간 테이블에 추가
    const intermediate: CreateIntermediateDto = {
      category_id: newCategory.category_id,
      brand_id: createCategoryDto.brand_id,
    };
    await this.intermediateRepository.save(intermediate);

    // 중간 테이블에서 중복되는 category_id들 정리
    if (
      createCategoryDto.brand_id !== null &&
      createCategoryDto.brand_id !== undefined
    ) {
      const sameBrands = await this.query.findRecordsByValues(
        [`${newCategory.brand_id}`],
        ['brand_id'],
        this.intermediateRepository,
      );

      // 중간 테이블에 지금 입력한 것 외에도 같은 brand_id 값을 가진 레코드가 있을 때
      if (sameBrands.length > 1) {
        const nullRecords = sameBrands.filter((el) => el.category_id === null);

        for (const el of nullRecords) {
          el.brand_id = null;
          await this.intermediateRepository.save(el);
        }
        await this.intermediateRepository.remove(nullRecords);
      }
    }

    return newCategory;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async lookUp(
    categoryNames: string[],
    product: boolean,
    brand: boolean,
  ): Promise<any> {
    let results: any[];
    const isBrand = brand;
    const isProduct = product;

    const columnNames = Array(categoryNames.length).fill('category_name');

    const categories = await this.query.findRecordsByValues(
      categoryNames,
      columnNames,
      this.categoryRepository,
    );

    results = categories;

    // 카테고리 -> 중간테이블
    if (isProduct || isBrand) {
      const categoryIds = categories.map((category) => category.category_id);
      const categoryColumnNames = Array(categoryIds.length).fill('category_id');

      const intermediates = await this.query.findRecordsByValues(
        categoryIds,
        categoryColumnNames,
        this.intermediateRepository,
      );

      const brandIds = intermediates.map(
        (intermediate) => intermediate.brand_id,
      );

      const brandColumnNames = Array(brandIds.length).fill('brand_id');

      // 중간테이블 -> 브랜드
      if (isBrand) {
        const brands = await this.query.findRecordsByValues(
          brandIds,
          brandColumnNames,
          this.brandRepository,
        );

        results = brands;
      }

      // 카테고리 -> 중간테이블 -> 프로덕트
      if (isProduct) {
        const products = await this.productRepository
          .createQueryBuilder('product')
          .where('product.category_id IN (:...categoryIds)', { categoryIds })
          .andWhere('product.brand_id IN (:...brandIds)', { brandIds })
          .getMany();

        results = products;
      }
    }

    return results;
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
    const categories = await this.query.findRecordsByValues(
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

    // 값이 하나도 없는 중간 테이블의 레코드들 삭제
    const areEmpties = await this.query.findRecordsByValues(
      [null, null],
      ['brand_id', 'category_id'],
      this.intermediateRepository,
    );

    if (areEmpties.length > 0)
      await this.intermediateRepository.remove(areEmpties);

    return await this.categoryRepository.remove(categories);
  }
}
