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
import { Intermediate } from 'src/intermediate.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column()
  sex: string;

  @Column()
  brand_id: number;

  @Column()
  category_id: number;

  @Column()
  is_kids: boolean;

  @Column()
  sales_quantity: number;

  // 브랜드카테고리에 join 됨
  @ManyToMany(() => Intermediate)
  @JoinTable()
  intermediates: Intermediate[];
}
