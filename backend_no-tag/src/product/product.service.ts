import { Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { Intermediate } from 'src/intermediate.entity';

import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
    private brandService: BrandService,
    private categoryService: CategoryService,
  ) {}

  findCommonNumbers(arrA: number[], arrB: number[]): number[] {
    return arrA.filter((number) => arrB.includes(number));
  }

  private mergeRecords(records: Intermediate[]): Intermediate {
    return records.reduce((updatedRecord, record) => {
      if (record.category_id !== null) {
        updatedRecord.category_id = record.category_id;
      }

      if (record.brand_id !== null) {
        updatedRecord.brand_id = record.brand_id;
      }

      return updatedRecord;
    }, new Intermediate());
  }

  async updateIntermediate(
    brand_id: number,
    category_id: number,
  ): Promise<void> {
    const query = await this.intermediateRepository
      .createQueryBuilder('intermediate')
      .select('intermediate.intermediate_id');

    let intermediate = await query
      .where('intermediate.brand_id = :brand_id', { brand_id })
      .getMany();

    const intermediateIdsOfBrand = intermediate.map(
      (intermediate) => intermediate.intermediate_id,
    );

    intermediate = await query
      .where('intermediate.category_id = :category_id', { category_id })
      .getMany();

    const intermediateIdsOfCategory = intermediate.map(
      (intermediate) => intermediate.intermediate_id,
    );

    const commonIDs = this.findCommonNumbers(
      intermediateIdsOfBrand,
      intermediateIdsOfCategory,
    );

    // 기존에 있던 상품. Intermediate 테이블 건드릴 필요 없음
    if (commonIDs.length !== 0) return;

    // 새로 추가된 상품. Intermediate 테이블 업데이트 해야 됨
    const recordsToMerge = await this.intermediateRepository.find({
      where: [
        { intermediate_id: In(intermediateIdsOfBrand) },
        { intermediate_id: In(intermediateIdsOfCategory) },
      ],
    });

    const updatedRecord = this.mergeRecords(recordsToMerge);

    await this.intermediateRepository.save(updatedRecord);

    await this.intermediateRepository.delete({
      intermediate_id: In([
        ...intermediateIdsOfBrand,
        ...intermediateIdsOfCategory,
      ]),
    });

    return;
  }

  async create(createProductDto: CreateProductDto) {
    // 중간 테이블 업데이트
    await this.updateIntermediate(
      createProductDto.brand_id,
      createProductDto.category_id,
    );

    return await this.productRepository.save(createProductDto);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(product_id: number) {
    return await this.productRepository.findOne({ where: { product_id } });
  }

  async update(product_id: number, updateProductDto: UpdateProductDto) {
    const brand = await this.brandService.findOne(updateProductDto.brand_id);
    const category = await this.categoryService.findOne(
      updateProductDto.category_id,
    );
    const product = await this.findOne(product_id);

    if (!brand || !category || !product) {
      throw new Error('Not found one of IDs');
    }

    // DB에 덮어쓰기
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
