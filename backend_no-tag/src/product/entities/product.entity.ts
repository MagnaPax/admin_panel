import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Category } from '../../category/entities/category.entity';
import { BrandCategory } from '../../brand-category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  sex: string;

  @Column()
  is_kids: boolean;

  @Column()
  sales_quantity: number;

  // 브랜드에 left join 됨
  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  // 카테고리에 left join 됨
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  // 브랜드카테고리에 join 됨
  @ManyToMany(() => BrandCategory)
  @JoinTable()
  brandCategories: BrandCategory[];
}
