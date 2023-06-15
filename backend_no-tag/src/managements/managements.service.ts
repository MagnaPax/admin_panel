import { Injectable } from '@nestjs/common';
import { CreateManagementDto } from './dto/create-management.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateManagementDto } from './dto/update-management.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class ManagementsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createBrand(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create({
      brand_name: createBrandDto.name,
    });
    return await this.brandRepository.save(brand);
  }

  async findAllBrand() {
    return await this.brandRepository.find();
  }

  async findOneBrand(brand_id: number) {
    return await this.brandRepository.findOne({ where: { brand_id } });
  }

  async updateBrand(brand_id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOneBrand(brand_id);
    if (!brand) {
      throw new Error('Not found the brand');
    }
    Object.assign(brand, updateBrandDto);
    return await this.brandRepository.save(brand);
  }

  async removeBrand(brand_id: number) {
    const brand = await this.findOneBrand(brand_id);
    if (!brand) {
      throw new Error('Not found the brand');
    }
    return await this.brandRepository.remove(brand);
  }
}
