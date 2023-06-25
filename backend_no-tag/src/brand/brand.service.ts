import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { Intermediate } from 'src/intermediate.entity';
import { CreateIntermediateDto } from 'src/create-intermediate.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Intermediate)
    private intermediateRepository: Repository<Intermediate>,
  ) {}

  async add(createBrandDto: CreateBrandDto) {
    const brand = await this.brandRepository.save(createBrandDto);

    // 중간 테이블 업데이트
    const createIntermediateDto: CreateIntermediateDto = {
      brand_id: brand.brand_id,
    };
    await this.intermediateRepository.save(createIntermediateDto);

    return brand;
  }

  async findAll() {
    return await this.brandRepository.find();
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
    const brand = await this.findOne(brand_id);
    if (!brand) {
      throw new Error('Not found the brand');
    }
    return await this.brandRepository.remove(brand);
  }
}
