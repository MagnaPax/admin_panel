export class CreateManagementDto {}

export class CreateBrandDto {
  id: number;
  name: string;
}

export class CreateCategoryDto {
  id: number;
  name: string;
}

export class CreateProductDto {
  id: number;
  name: string;
  brand: CreateBrandDto;
  category: CreateCategoryDto;
  sex: string;
  isKids: boolean;
  salesQuantity: number;
}
