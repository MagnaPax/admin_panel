import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { BrandCategory } from '../../brand-category.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  @Column()
  brand_name: string;

  // 프로덕트를 left join. brand TO product
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  // 카테고리를 left join. brand TO category
  @OneToMany(() => Category, (category) => category.brand)
  categories: Category[];

  // 브랜드카테고리를 left join. brand TO brand-category
  @OneToMany(() => BrandCategory, (brandCategories) => brandCategories.brand)
  brandCategories: BrandCategory[];

  // 카테고리에 left join 됨
  @ManyToOne(() => Category, (category) => category.brands)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
