import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Intermediate } from 'src/intermediate.entity';
import { CreateIntermediateDto } from 'src/create-intermediate.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    return await this.productRepository.save(createProductDto);
  }

  findCommonNumbers(arrA: number[], arrB: number[]): number[] {
    return arrA.filter((number) => arrB.includes(number));
  }

  async findIn(brand_id: number, category_id: number) {
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

    if (commonIDs.length !== 0) {
      console.log(
        '중간테이블에 기존에 있던 것. intermediate 건드릴 필요 없음. 그런데 같은게 여러개 나올 수도 있나???',
      );
    } else {
      console.log('새로 추가된 것');
    }

    return [1111111111];
  }

  async add(createProductDto: CreateProductDto) {
    const commonIDs = await this.findIn(
      createProductDto.brand_id,
      createProductDto.category_id,
    );

    // 중간 테이블 업데이트
    const createIntermediateDto: CreateIntermediateDto = {
      // brand_id: brand.brand_id,
    };
    await this.intermediateRepository.save(createIntermediateDto);

    const product = await this.productRepository.save(createProductDto);
    return product;
  }

  async findAll() {
    return await this.productRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
