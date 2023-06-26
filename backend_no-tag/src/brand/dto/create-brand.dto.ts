import { IsDefined, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsDefined()
  @IsString()
  brand_name: string;
}
