import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  category_name: string;

  @IsOptional()
  @IsNumber()
  brand_id: number;
}
