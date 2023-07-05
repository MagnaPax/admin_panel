import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Query } from 'src/queryHelper';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CreateIntermediateDto } from 'src/create-intermediate.dto';

import { Brand } from './entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { Intermediate } from 'src/intermediate.entity';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class BrandService {
  private query = new Query();

  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    // 브랜드 이름이 중복되지 않게
    const isDuplicated = await this.query.findRecordsByValues(
      [`${createBrandDto.brand_name}`],
      ['brand_name'],
      this.brandRepository,
    );
    if (isDuplicated.length !== 0) throw new Error(`It's duplicated value`);

    // 브랜드 추가
    const newBrand = await this.brandRepository.save(createBrandDto);

    // 중간 테이블에 추가
    const intermediate: CreateIntermediateDto = {
      brand_id: newBrand.brand_id,
      category_id: createBrandDto.category_id,
    };
    await this.intermediateRepository.save(intermediate);

    // 중간 테이블에서 중복되는 brand_id들 정리
    if (
      createBrandDto.category_id !== null &&
      createBrandDto.category_id !== undefined
    ) {
      const sameCategories = await this.query.findRecordsByValues(
        [`${newBrand.category_id}`],
        ['category_id'],
        this.intermediateRepository,
      );

      // 중간 테이블에 지금 입력한 category_id와 값을 가진 레코드가 있다면 null로 바꾼 뒤 삭제
      if (sameCategories.length > 1) {
        const nullRecords = sameCategories.filter((el) => el.brand_id === null);

        for (const el of nullRecords) {
          el.category_id = null;
          await this.intermediateRepository.save(el);
        }
        await this.intermediateRepository.remove(nullRecords);
      }
    }

    return newBrand;
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async lookUp(
    brandNames: string[],
    category: boolean,
    product: boolean,
  ): Promise<any> {
    let results: any[];
    const isCategory = category;
    const isProduct = product;

    const columnNames = Array(brandNames.length).fill('brand_name');

    const brands = await this.query.findRecordsByValues(
      brandNames,
      columnNames,
      this.brandRepository,
    );

    results = brands;

    // 브랜드 -> 중간테이블
    if (isProduct || isCategory) {
      const brandIds = brands.map((brand) => brand.brand_id);
      const brandColumnNames = Array(brandIds.length).fill('brand_id');

      const intermediates = await this.query.findRecordsByValues(
        brandIds,
        brandColumnNames,
        this.intermediateRepository,
      );

      const categoryIds = intermediates.map(
        (intermediate) => intermediate.category_id,
      );

      const categoryColumnNames = Array(categoryIds.length).fill('category_id');

      // 중간테이블 -> 카테고리
      if (isCategory) {
        const categories = await this.query.findRecordsByValues(
          categoryIds,
          categoryColumnNames,
          this.categoryRepository,
        );

        results = categories;
      }

      // 브랜드 -> 중간테이블 -> 프로덕트
      if (isProduct) {
        const products = await this.productRepository
          .createQueryBuilder('product')
          .where('product.brand_id IN (:...brandIds)', { brandIds })
          .andWhere('product.category_id IN (:...categoryIds)', { categoryIds })
          .getMany();

        results = products;
      }
    }

    return results;
  }

  async findOne(brand_id: number) {
    return await this.brandRepository.findOne({ where: { brand_id } });
  }

  async update(brand_id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(brand_id);
    if (!brand) {
      throw new Error('Not found the brand');
    }
    Object.assign(brand, updateBrandDto);
    return await this.brandRepository.save(brand);
  }

  async remove(brand_id: number) {
    const brands = await this.query.findRecordsByValues(
      [`${brand_id}`],
      ['brand_id'],
      this.brandRepository,
    );

    if (!brands) throw new Error('Not found the brand');

    // Intermediate 엔티티 수정
    await this.intermediateRepository
      .createQueryBuilder()
      .update(Intermediate)
      .set({ brand_id: null })
      .where('brand_id = :brandId', { brandId: brand_id })
      .execute();

    // Product 엔티티 수정
    await this.productRepository
      .createQueryBuilder()
      .update(Product)
      .set({ brand_id: null })
      .where('brand_id = :brandId', { brandId: brand_id })
      .execute();

    // 값이 하나도 없는 중간 테이블 삭제
    const areEmpties = await this.query.findRecordsByValues(
      [null, null],
      ['brand_id', 'category_id'],
      this.intermediateRepository,
    );

    if (areEmpties) await this.intermediateRepository.remove(areEmpties);

    return await this.brandRepository.remove(brands);
  }
}
