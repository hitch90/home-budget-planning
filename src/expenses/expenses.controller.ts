import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateExpenseDto } from './create-expense.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ExpenseService } from './expense.service';
import { Expense } from './expense.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class ExpensesController {
  constructor(private expenseService: ExpenseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('api/expense')
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<null> {
    return this.expenseService.create(createExpenseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/expense/id/:id')
  findOne(@Param() params): Promise<Expense> {
    return this.expenseService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('api/expense/id/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.expenseService.delete(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/expenses')
  findAllExpenses(@Query() query): Promise<Expense[] | any> {
    return this.expenseService.findAllExpenses(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/expenses/months')
  monthExpenses(): Promise<number[]> {
    return this.expenseService.expensesInMonths();
  }
}
