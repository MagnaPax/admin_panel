export class CreateManagementDto {}

export class BrandDto {
  id: number;
  name: string;
}

export class CategoryDto {
  id: number;
  name: string;
}

export class ProductDto {
  id: number;
  name: string;
  brand: BrandDto;
  category: CategoryDto;
  gender: string;
  isKids: boolean;
  salesQuantity: number;
}
