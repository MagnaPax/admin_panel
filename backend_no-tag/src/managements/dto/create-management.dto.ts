export class CreateManagementDto {}

export class CreateBrandDto {
  name: string;
}

export class CreateCategoryDto {
  name: string;
}

export class CreateProductDto {
  name: string;
  brand: CreateBrandDto;
  category: CreateCategoryDto;
  sex: string;
  isKids: boolean;
  salesQuantity: number;
}
