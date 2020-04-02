import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './income.entity';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { AccountModule } from '../accounts/account.module';
import { CategoryModule } from '../categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Income]),
    forwardRef(() => AccountModule),
    forwardRef(() => CategoryModule),
  ],
  providers: [IncomeService],
  controllers: [IncomeController],
  exports: [IncomeService],
})
export class IncomeModule {}
