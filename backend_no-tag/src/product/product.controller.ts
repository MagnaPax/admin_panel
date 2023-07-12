import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RemoveProductDto } from './dto/remove-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { MakeProductDto } from './dto/make-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('files', 3))
  uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: MakeProductDto,
  ) {
    console.log(files);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async createData(
    @UploadedFile('file') file: Express.Multer.File,
    @Body() request: MakeProductDto,
  ) {
    console.log(file);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('search')
  search(@Query() query: SearchProductDto) {
    return this.productService.lookUp(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete()
  remove(@Body() removeProductDto: RemoveProductDto) {
    return this.productService.remove(removeProductDto);
  }
}
