import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNumber()
  brand_id: number;

  @IsNumber()
  category_id: number;

  @IsString()
  sex: string;

  @IsBoolean()
  is_kids: boolean;

  @IsNumber()
  @IsPositive()
  sales_quantity: number;
}
