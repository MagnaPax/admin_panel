import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  brand_name: string;

  @IsOptional()
  @IsNumber()
  category_id: number;
}
