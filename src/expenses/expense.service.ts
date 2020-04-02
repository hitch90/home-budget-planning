import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Expense } from './expense.entity';
import { AccountService } from '../accounts/account.service';
import { CategoryService } from '../categories/category.service';
import { addYears, subYears } from 'date-fns';
import * as dayjs from 'dayjs';

export const AfterDate = (date: Date) => Between(date, addYears(date, 100));
export const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,

    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  findOne(id: number): Promise<Expense> {
    return this.expenseRepository.findOne(
      { id },
      { relations: ['category', 'account'] },
    );
  }

  async create(expense): Promise<any> {
    await this.accountService.calcExpense(
      expense.value,
      expense.account,
      'add',
    );
    return this.expenseRepository.insert(expense);
  }

  update(id: number, expense) {
    return this.expenseRepository.update({ id }, expense);
  }

  async delete(id: number) {
    const expense = await this.findOne(id);
    await this.accountService.calcExpense(
      expense.value,
      expense.account.id,
      'minus',
    );
    return this.expenseRepository.delete({ id });
  }

  async findAllExpenses(query) {
    const where: any = {};
    let order = {};
    let category = {};
    let account = {};
    let take = 0;
    let sum = 0;

    if (query.month && query.year) {
      const { month, year } = query;
      const lastDay = dayjs(`${year}-${month}`).daysInMonth();
      where.date = Between(
        `${year}-${month}-01`,
        `${year}-${month}-${lastDay}`,
      );
    } else if (query.from && query.to) {
      where.date = Between(query.from, query.to);
    } else if (query.from) {
      where.date = AfterDate(new Date(query.from));
    } else if (query.to) {
      where.date = BeforeDate(new Date(query.to));
    }

    if (query.category) {
      category = await this.categoryService.findOne(query.category);
      where.category = query.category;
    }

    if (query.account) {
      account = await this.accountService.findOne(query.account);
      where.account = query.account;
    }

    if (query.order) {
      order = {
        [query.order]: query.direction || 'DESC',
      };
    }

    if (query.limit) {
      take = query.limit;
    }

    const list = await this.expenseRepository.find({
      where,
      order,
      take,
      relations: ['category', 'account'],
    });
    list.map(item => (sum += item.value));

    return {
      list,
      category,
      account,
      sum,
      items: list.length,
    };
  }

  async expensesInMonths(): Promise<number[]> {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const list = await this.findAllExpenses({
        month: i + 1,
        year: new Date().getFullYear(),
      });
      months[i] = list.sum;
    }
    return months;
  }
}
