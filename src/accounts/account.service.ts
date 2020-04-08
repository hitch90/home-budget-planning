import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import { Account } from './account.entity';
import { ExpenseService } from '../expenses/expense.service';
import { IncomeService } from '../incomes/income.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @Inject(forwardRef(() => ExpenseService))
    private expenseService: ExpenseService,

    @Inject(forwardRef(() => IncomeService))
    private incomeService: IncomeService,
  ) {}

  findAll(query = null): Promise<Account[]> {
    const where: any = {};
    if (query !== null) {
      if (query.type) {
        where.type = query.type;
      }
    }
    return this.accountRepository.find(where);
  }

  findOne(id: number): Promise<Account> {
    return this.accountRepository.findOne({ id });
  }

  create(account): Promise<any> {
    return this.accountRepository.insert(account);
  }

  update(id: number, account) {
    return this.accountRepository.update({ id }, account);
  }

  async delete(id: number) {
    const expenses = await this.expenseService.findAllExpenses({ account: id });
    const incomes = await this.incomeService.findAllIncomes({ account: id });
    for (const item of expenses.list) {
      await this.expenseService.update(item.id, { account: 1 });
      await this.calcExpense(item.value, 1);
    }

    for (const item of incomes.list) {
      await this.incomeService.update(item.id, { account: 1 });
      await this.calcIncome(item.value, 1);
    }
    return this.accountRepository.delete({ id });
  }

  async calcExpense(value, accountId, type = 'add') {
    const account = await this.findOne(accountId);
    let newValue = account.currentValue;
    if (type === 'add') {
      newValue = newValue - value;
    } else if (type === 'minus') {
      newValue = newValue + value;
    }
    this.update(accountId, { currentValue: newValue });
    return true;
  }

  async calcIncome(value, accountId, type = 'add') {
    const account = await this.findOne(accountId);
    let newValue = account.currentValue;
    if (type === 'add') {
      newValue = newValue + value;
    } else if (type === 'minus') {
      newValue = newValue - value;
    }
    this.update(accountId, { currentValue: newValue });
    return true;
  }

  async getBalance() {
    const accounts = await this.findAll({ type: Not('credit') });
    let balance = 0;
    for (const item of accounts) {
      balance = balance + item.currentValue;
    }
    return balance;
  }

  async transfer({ from, to, value }) {
    try {
      const fromAcc = await this.findOne(from);
      const toAcc = await this.findOne(to);
      this.update(from, { currentValue: fromAcc.currentValue - value });
      this.update(to, { currentValue: toAcc.currentValue + value });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}
