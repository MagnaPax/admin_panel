import { Module } from '@nestjs/common';
import { ManagementsService } from './managements.service';
import { ManagementsController } from './managements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Category, Product])],
  controllers: [ManagementsController],
  providers: [ManagementsService],
})
export class ManagementsModule {}
