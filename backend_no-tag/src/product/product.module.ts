import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Intermediate } from 'src/intermediate.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';
import { BrandService } from 'src/brand/brand.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Intermediate, Brand, Category])],
  controllers: [ProductController],
  providers: [ProductService, BrandService, CategoryService],
})
export class ProductModule {}
