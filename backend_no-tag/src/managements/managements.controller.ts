import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ManagementsService } from './managements.service';
import { CreateManagementDto } from './dto/create-management.dto';
import { CreateBrandDto } from './dto/create-brand.dto';

import { UpdateManagementDto } from './dto/update-management.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('managements')
export class ManagementsController {
  constructor(private readonly managementsService: ManagementsService) {}

  @Post('brand')
  createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.managementsService.createBrand(createBrandDto);
  }

  @Get('brand')
  findAllBrand() {
    return this.managementsService.findAllBrand();
  }

  @Get('brand/:brand_id')
  findOneBrand(@Param('brand_id') brand_id: string) {
    return this.managementsService.findOneBrand(+brand_id);
  }

  @Patch('brand/:brand_id')
  updateBrand(
    @Param('brand_id') brand_id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    return this.managementsService.updateBrand(+brand_id, updateBrandDto);
  }

  @Delete('brand/:brand_id')
  removeBrand(@Param('brand_id') brand_id: string) {
    return this.managementsService.removeBrand(+brand_id);
  }
}
