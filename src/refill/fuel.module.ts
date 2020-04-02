import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelService } from './fuel.service';
import { Fuel } from './fuel.entity';
import { FuelController } from './fuel.controller';
import { ExpenseModule } from '../expenses/expense.module';

@Module({
  imports: [TypeOrmModule.forFeature([Fuel]), forwardRef(() => ExpenseModule)],
  providers: [FuelService],
  controllers: [FuelController],
  exports: [FuelService],
})
export class FuelModule {}
