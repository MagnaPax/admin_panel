import {
  IsDefined,
  IsNumber,
  IsString,
  IsBoolean,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @IsDefined()
  @IsString()
  product_name: string;

  @IsDefined()
  @IsNumber()
  brand_id: number;

  @IsDefined()
  @IsNumber()
  category_id: number;

  @IsDefined()
  @IsString()
  sex: string;

  @IsDefined()
  @IsBoolean()
  is_kids: boolean;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  sales_quantity: number;
}
