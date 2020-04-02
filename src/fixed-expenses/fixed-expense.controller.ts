import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { FixedExpenseService } from './fixed-expense.service';
import { CreateFixedExpenseDto } from './create-fixed-expense.dto';
import { Expense } from '../expenses/expense.entity';

@Controller()
export class FixedExpenseController {
  constructor(private expenseService: FixedExpenseService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('api/fixed-expense')
  async create(@Body() createExpenseDto: CreateFixedExpenseDto): Promise<null> {
    return this.expenseService.create(createExpenseDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/fixed-expense/id/:id')
  findOne(@Param() params): Promise<Expense> {
    return this.expenseService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('api/fixed-expense/id/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.expenseService.delete(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/fixed-expenses')
  findAllExpenses(@Query() query): Promise<Expense[] | any> {
    return this.expenseService.findAllExpenses(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/fixed-expenses/months')
  monthExpenses(): Promise<number[]> {
    return this.expenseService.expensesInMonths();
  }
}
