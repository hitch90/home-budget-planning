import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountService } from './account.service';
import { AccountsController } from './accounts.controller';
import { ExpenseModule } from '../expenses/expense.module';
import { IncomeModule } from '../incomes/income.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => ExpenseModule),
    forwardRef(() => IncomeModule),
  ],
  providers: [AccountService],
  controllers: [AccountsController],
  exports: [AccountService],
})
export class AccountModule {}
