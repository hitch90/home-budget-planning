import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../accounts/account.module';
import { CategoryModule } from '../categories/category.module';
import { FixedExpenses } from './fixed-expense.entity';
import { FixedExpenseService } from './fixed-expense.service';
import { FixedExpenseController } from './fixed-expense.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([FixedExpenses]),
    forwardRef(() => AccountModule),
    forwardRef(() => CategoryModule),
  ],
  providers: [FixedExpenseService],
  controllers: [FixedExpenseController],
  exports: [FixedExpenseService],
})
export class FixedExpenseModule {}
