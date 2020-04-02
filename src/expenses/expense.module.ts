import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { ExpenseService } from './expense.service';
import { ExpensesController } from './expenses.controller';
import { AccountModule } from '../accounts/account.module';
import { CategoryModule } from '../categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense]),
    forwardRef(() => AccountModule),
    forwardRef(() => CategoryModule),
  ],
  providers: [ExpenseService],
  controllers: [ExpensesController],
  exports: [ExpenseService],
})
export class ExpenseModule {}
