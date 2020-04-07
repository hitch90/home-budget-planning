import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expense } from '../expenses/expense.entity';
import { Income } from '../incomes/income.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  color: string;

  @Column()
  type: string;

  @ManyToOne(
    type => Category,
    category => category.children,
  )
  parent: Category;

  @OneToMany(
    type => Category,
    category => category.parent,
  )
  children: Category[];

  @OneToMany(
    type => Expense,
    expense => expense.category,
  )
  expenses: Expense;

  @OneToMany(
    type => Income,
    income => income.category,
  )
  incomes: Income;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: number;
}
