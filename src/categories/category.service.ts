import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { ExpenseService } from '../expenses/expense.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(forwardRef(() => ExpenseService))
    private expenseService: ExpenseService,
  ) {}

  async findAll(): Promise<any> {
    return await this.categoryRepository.find({
      relations: ['parent', 'expenses', 'children'],
    });
  }

  async findParentCategory(): Promise<Category[]> {
    return await this.categoryRepository.find({ where: { parent: null } });
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ id }, { relations: ['children'] });
  }

  create(category): Promise<any> {
    if (!category.parent) {
      category.parent = null;
    }
    return this.categoryRepository.insert(category);
  }

  update(id: number, category) {
    return this.categoryRepository.update({ id }, category);
  }

  delete(id: number) {
    return this.categoryRepository.delete({ id });
  }

  findByFilters(query) {
    const where: any = {};
    let order = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.parent) {
      where.parent = query.parent;
      if (query.parent === 'null') {
        where.parent = null;
      }
      // tslint:disable-next-line:triple-equals
      if (query.sum == 1) {
        return this.findParentCategoryWithExpenses();
      }
    }

    if (query.order) {
      order = {
        [query.order]: query.direction || 'DESC',
      };
    }

    return this.categoryRepository.find({
      where,
      order,
      relations: ['parent', 'expenses', 'incomes', 'children'],
    });
  }

  async findParentCategoryWithExpenses() {
    const parents = await this.categoryRepository.find({
      where: { parent: null },
      relations: ['parent', 'children'],
    });
    const categories = [];
    for (const parent of parents) {
      if (parent.children.length) {
        let expensesSum = 0;
        for (const child of parent.children) {
          const expenses = await this.expenseService.findAllExpenses({
            category: child.id,
          });
          expensesSum = expensesSum + this.calc(expenses.list);
        }
        categories.push({
          ...parent,
          expensesSum,
        });
      } else {
        const expenses = await this.expenseService.findAllExpenses({
          category: parent.id,
        });
        categories.push({
          ...parent,
          expensesSum: this.calc(expenses.list),
        });
      }
    }
    return categories;
  }

  calc(arr) {
    return arr.reduce((previousValue, expense) => previousValue + expense.value, 0);
  }
}
