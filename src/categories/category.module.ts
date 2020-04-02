import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CategoriesController } from './categories.controller';
import { ExpenseModule } from '../expenses/expense.module';
import { IncomeModule } from '../incomes/income.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => ExpenseModule),
    forwardRef(() => IncomeModule),
  ],
  providers: [CategoryService],
  controllers: [CategoriesController],
  exports: [CategoryService],
})
export class CategoryModule {}
