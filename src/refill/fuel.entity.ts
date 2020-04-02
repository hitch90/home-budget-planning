import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { Account } from '../accounts/account.entity';

@Entity()
export class Fuel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column({ type: 'double' })
  value: number;

  @Column({ type: 'double' })
  unitValue: number;

  @Column({ type: 'double' })
  mileage: number;

  @Column({ type: 'double' })
  prevMileage: number;

  @Column({ type: 'double' })
  fuel: number;

  @Column()
  car: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column()
  currency: string;

  @ManyToOne(type => Category)
  category: Category;

  @ManyToOne(type => Account)
  account: Account;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: number;
}
