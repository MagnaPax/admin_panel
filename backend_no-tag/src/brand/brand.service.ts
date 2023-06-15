import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    // const brand = this.brandRepository.create({
    //   brand_name: createBrandDto.name,
    // });
    // return await this.brandRepository.save(brand);
    return await this.brandRepository.save(createBrandDto);
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
