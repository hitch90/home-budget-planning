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
    return await this.categoryRepository.find({ relations: ['parent', 'expenses'] });
  }

  findOne(id: number): Promise<Category> {
    return this.categoryRepository.findOne({ id }, { relations: ['children'] });
  }

  create(category): Promise<any> {
    return this.categoryRepository.insert(category);
  }

  update(id: number, category) {
    return this.categoryRepository.update({ id }, category);
  }

  delete(id: number) {
    return this.categoryRepository.delete({ id });
  }

}
