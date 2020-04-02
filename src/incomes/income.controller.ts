import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import { CreateIncomeDto } from './create-income.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IncomeService } from './income.service';
import { Income } from './income.entity';
import * as dayjs from 'dayjs';
import { AuthGuard } from '@nestjs/passport';
import { Expense } from '../expenses/expense.entity';

@Controller()
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('income')
  @HttpCode(204)
  async create(@Body() createIncomeDto: CreateIncomeDto): Promise<null> {
    return this.incomeService.create(createIncomeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('incomes')
  findAll(@Query() query): Promise<Income[]> {
    const { filters, limit, month, account, category } = query;
    if (limit) {
      return this.incomeService.findAll(query.limit);
    } else if (filters) {
      return this.incomeService.findByQuery(query);
    } else if (month) {
      const year = new Date().getFullYear();
      const lastDay = dayjs(`${year}-${month}`).daysInMonth();
      return this.incomeService.getBetweenDates({
        from: `${year}-${month}-01`,
        to: `${year}-${parseInt(month, 10) + 1}-${lastDay}`,
      });
    } else if (account) {
      return this.incomeService.findByAccountId(account);
    } else if (category) {
      return this.incomeService.findByCategory(category);
    } else {
      return;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('income/:id')
  findOne(@Param() params): Promise<Income> {
    return this.incomeService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('income/:id')
  @HttpCode(204)
  update(
    @Param() params,
    @Body() updateIncomeDto: CreateIncomeDto,
  ): Promise<UpdateResult> {
    return this.incomeService.update(params.id, updateIncomeDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('income/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.incomeService.delete(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/incomes')
  findAllExpenses(@Query() query): Promise<Expense[] | any> {
    return this.incomeService.findAllIncomes(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/incomes/months')
  monthExpenses(): Promise<number[]> {
    return this.incomeService.incomesInMonths();
  }

}
