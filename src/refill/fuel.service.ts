import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Fuel } from './fuel.entity';
import * as dayjs from 'dayjs';
import { ExpenseService } from '../expenses/expense.service';

@Injectable()
export class FuelService {
  constructor(
    @InjectRepository(Fuel)
    private readonly fuelRepository: Repository<Fuel>,

    @Inject(forwardRef(() => ExpenseService))
    private expenseService: ExpenseService,
  ) {}

  findAll(take): Promise<any[]> {
    return this.fuelRepository.find({
      relations: ['category', 'account'],
      order: { date: 'DESC' },
      take,
    });
  }

  findByAccountId(accountId) {
    return this.fuelRepository.find({
      where: { account: accountId },
      relations: ['category', 'account'],
    });
  }

  findOne(id: number): Promise<any> {
    return this.fuelRepository.findOne(
      { id },
      { relations: ['category', 'account'] },
    );
  }

  async findItem(which = 'first') {
    const all = await this.fuelRepository.find({ order: { id: 'ASC' } });
    if (which === 'last') {
      return all[all.length - 1];
    } else if (which === 'first') {
      return all[0];
    } else {
      return;
    }
  }

  async create(fuel): Promise<any> {
    const lastItem = await this.findItem('last');
    let prevMileageValue = fuel.mileage;
    if (lastItem) {
      prevMileageValue = lastItem.mileage;
      if (prevMileageValue === fuel.mileage) {
        throw new Error();
      }
    }
    await this.expenseService.create(fuel);
    return this.fuelRepository.insert({
      ...fuel,
      prevMileage: prevMileageValue,
    });
  }

  async delete(id: number) {
    return this.fuelRepository.delete({ id });
  }

  getBetweenDates(dates) {
    const fromDate = new Date(dates.from).toISOString();
    const toDate = new Date(dates.to).toISOString();
    return this.fuelRepository.find({
      relations: ['category', 'account'],
      where: {
        date: Between(fromDate, toDate),
      },
      order: { date: 'DESC' },
    });
  }

  async consumptionByMonth(month) {
    const year = new Date().getFullYear();
    const lastDay = dayjs(`${year}-${month}`).daysInMonth();
    const refills = await this.getBetweenDates({
      from: `${year}-${month}-01`,
      to: `${year}-${month}-${lastDay}`,
    });
    return refills.length > 1 ? { consumption: this.calcConsumption(refills) } : { consumption: 0 };
  }

  async consumptionPer100(since: string = 'all') {
    let refills = await this.findAll(0);
    if (dayjs(since).isValid()) {
      refills = refills.filter(item => dayjs(item.date) > dayjs(since));
    } else if (since === 'last') {
      refills = refills.slice(0, 2);
    }
    return refills.length > 1 ?  this.calcConsumption(refills) : 0;
  }

  calcConsumption(refills) {
    let fuel = 0;
    let startMileage = 0;
    let endMileage = 0;
    refills.map((item, index) => {
      if (index === 0) {
        startMileage = item.mileage;
      }
      if (index === refills.length - 1) {
        endMileage = item.mileage;
      }
      if (index !== refills.length - 1) {
        fuel += item.fuel;
      }
    });
    const travelMileage = startMileage - endMileage;
    return ((fuel / travelMileage) * 100).toFixed(2);
  }

  findByQuery(query) {
    const where: any = {};
    if (query.from && query.to) {
      where.date = Between(query.from, query.to);
    }
    if (query.account) {
      where.account = query.account;
    }
    return this.fuelRepository.find({
      relations: ['category', 'account'],
      where,
    });
  }
}
