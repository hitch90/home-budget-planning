import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Income } from './income.entity';
import { AccountService } from '../accounts/account.service';
import * as dayjs from 'dayjs';
import { AfterDate, BeforeDate } from '../expenses/expense.service';
import { Category } from '../categories/category.entity';
import { CategoryService } from '../categories/category.service';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,

    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService,

    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
  ) {}

  findAll(take): Promise<Income[]> {
    return this.incomeRepository.find({
      relations: ['category', 'account'],
      order: { date: 'DESC' },
      take,
    });
  }

  findOne(id: number): Promise<Income> {
    return this.incomeRepository.findOne(
      { id },
      { relations: ['category', 'account'] },
    );
  }

  create(income): Promise<any> {
    this.accountService.calcIncome(income.value, income.account, 'add');
    return this.incomeRepository.insert(income);
  }

  update(id: number, income) {
    return this.incomeRepository.update({ id }, income);
  }

  findByAccountId(accountId) {
    return this.incomeRepository.find({
      where: { account: accountId },
      relations: ['category', 'account'],
      order: { date: 'DESC' },
    });
  }

  findByCategory(id) {
    return this.incomeRepository.find({
      where: { category: id },
      relations: ['category', 'account'],
      order: { date: 'DESC' },
    });
  }

  async delete(id: number) {
    const income = await this.findOne(id);
    await this.accountService.calcIncome(
      income.value,
      income.account.id,
      'minus',
    );
    return this.incomeRepository.delete({ id });
  }

  getBetweenDates(dates) {
    const fromDate = new Date(dates.from).toISOString();
    const toDate = new Date(dates.to).toISOString();
    return this.incomeRepository.find({
      relations: ['category', 'account'],
      where: {
        date: Between(fromDate, toDate),
      },
      order: { date: 'DESC' },
    });
  }

  findByQuery(query) {
    const where: any = {};
    if (query.from && query.to) {
      where.date = Between(query.from, query.to);
    }
    if (query.category) {
      where.category = query.category;
    }
    if (query.account) {
      where.account = query.account;
    }
    return this.incomeRepository.find({
      relations: ['category', 'account'],
      where,
    });
  }

  async findAllIncomes(query) {
    const where: any = {};
    let order = {};
    let category = {};
    let account = {};
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

    console.log(where);
    const list = await this.incomeRepository.find({
      where,
      order,
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

  async incomesInMonths(): Promise<number[]> {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const list = await this.findAllIncomes({
        month: i + 1,
        year: new Date().getFullYear(),
      });
      months[i] = list.sum;
    }
    return months;
  }
}
