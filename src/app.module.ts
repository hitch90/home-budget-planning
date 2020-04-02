import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Category } from './categories/category.entity';
import { CategoryModule } from './categories/category.module';
import { Expense } from './expenses/expense.entity';
import { ExpenseModule } from './expenses/expense.module';
import { Income } from './incomes/income.entity';
import { IncomeModule } from './incomes/income.module';
import { Account } from './accounts/account.entity';
import { AccountModule } from './accounts/account.module';
import { FuelModule } from './refill/fuel.module';
import { Fuel } from './refill/fuel.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { FixedExpenses } from './fixed-expenses/fixed-expense.entity';
import { FixedExpenseModule } from './fixed-expenses/fixed-expense.module';
let config = process.env;

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line:no-var-requires
  const result = require('dotenv').config();
  if (result.error) {
    throw result.error;
  }
  config = result.parsed;
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.host,
      port: 3306,
      username: config.username,
      password: config.password,
      database: config.database,
      entities: [Category, Expense, Income, Account, Fuel, FixedExpenses],
      synchronize: true,
    }),
    CategoryModule,
    ExpenseModule,
    IncomeModule,
    AccountModule,
    FuelModule,
    AuthModule,
    UsersModule,
    FixedExpenseModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
