import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from 'src/product/entities/product.entity';
import { Brand } from 'src/brand/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, Brand])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
