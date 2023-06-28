import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  brand_name: string;
}
