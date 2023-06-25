import { IsOptional } from 'class-validator';

export class CreateIntermediateDto {
  @IsOptional()
  brand_id?: number;

  @IsOptional()
  category_id?: number;
}
