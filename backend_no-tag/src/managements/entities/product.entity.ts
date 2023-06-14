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
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Brand)
  @JoinColumn()
  brand: Brand;

  @ManyToOne(() => Category)
  @JoinColumn()
  category: Category;

  @Column({ default: '' })
  sex: string;

  @Column({ default: false })
  isKids: boolean;

  @Column({ default: 0 })
  salesQuantity: number;
}
