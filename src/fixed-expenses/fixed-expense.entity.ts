import {
  Entity,
  Column,
} from 'typeorm';
import { Expense } from '../expenses/expense.entity';

@Entity()
export class FixedExpenses extends Expense {
  @Column()
  repeat: string;
}
