import {
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { Category } from './category/entities/category.entity';
import { Brand } from './brand/entities/brand.entity';
import { Product } from './product/entities/product.entity';

@Entity()
export class BrandCategory {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  brandId: number;

  // 카테고리에 left join 됨
  @ManyToOne(() => Category, (category) => category.brandCategories)
  @JoinColumn({ name: 'category_id' }) // 외래 키 칼럼 지정
  category: Category;

  // 브랜드에 left join 됨
  @ManyToOne(() => Brand, (brand) => brand.brandCategories)
  @JoinColumn({ name: 'brand_id' }) // 외래 키 칼럼 지정
  brand: Brand;

  // 프로덕트를 join. brand-category TO product
  @ManyToMany(() => Product, (product) => product.brandCategories)
  products: Product[];
}
