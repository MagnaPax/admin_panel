import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Intermediate } from 'src/intermediate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Intermediate])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
