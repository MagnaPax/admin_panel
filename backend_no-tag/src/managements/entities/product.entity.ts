import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @ManyToOne(() => Brand)
  @JoinColumn()
  brand_id: Brand;

  @ManyToOne(() => Category)
  @JoinColumn()
  category_id: Category;

  @Column({ default: '' })
  sex: string;

  @Column({ default: false })
  is_Kids: boolean;

  @Column({ default: 0 })
  sales_quantity: number;
}
