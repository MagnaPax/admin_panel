import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Brand } from 'src/brand/entities/brand.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  category_name: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
