import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  brand_id: number;

  // @Column({ default: '' })
  // brand_name: string;

  // @Column({ nullable: true, default: '기본 브랜드' })
  @Column()
  brand_name: string;
}
