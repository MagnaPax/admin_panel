import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { BrandCategory } from '../../brand-category.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  // 프로덕트를 left join. category TO product
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // 브랜드를 left join. category TO brand
  @OneToMany(() => Brand, (brand) => brand.category)
  brands: Brand[];

  // 브랜드카테고리를 left join. brand TO brand-category
  @OneToMany(() => BrandCategory, (brandCategories) => brandCategories.category)
  brandCategories: BrandCategory[];

  // 브랜드에 left join 됨
  @ManyToOne(() => Brand, (brand) => brand.category)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // 프로덕트에 left join 됨
  @ManyToOne(() => Product, (product) => product.category)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
