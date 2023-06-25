import {
  Entity,
  ManyToOne,
  Column,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category/entities/category.entity';
import { Brand } from './brand/entities/brand.entity';
import { Product } from './product/entities/product.entity';

@Entity()
export class Intermediate {
  @PrimaryGeneratedColumn()
  intermediate_id: number;

  @Column({ nullable: true, default: null })
  brand_id: number;

  @Column({ nullable: true, default: null })
  category_id: number;

  // 카테고리에 left join 됨
  @ManyToOne(() => Category, (category) => category.intermediates)
  @JoinColumn({ name: 'category_id' }) // 외래 키 칼럼 지정
  category: Category;

  // 브랜드에 left join 됨
  @ManyToOne(() => Brand, (brand) => brand.intermediates)
  @JoinColumn({ name: 'brand_id' }) // 외래 키 칼럼 지정
  brand: Brand;

  // 프로덕트를 join. intermediate TO product
  @ManyToMany(() => Product, (product) => product.intermediates)
  products: Product[];
}
