import { IsDefined, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsDefined()
  @IsString()
  category_name: string;
}
