import { IsDefined, IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsDefined()
  @IsString()
  category_name: string;
}
