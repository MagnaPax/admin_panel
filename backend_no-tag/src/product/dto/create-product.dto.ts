import {
  IsDefined,
  IsNumber,
  IsString,
  IsBoolean,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  brand_id: number;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  category_id: number;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  sex: string;

  @IsNotEmpty()
  @IsDefined()
  @IsBoolean()
  is_kids: boolean;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  @IsPositive()
  sales_quantity: number;
}
