import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { FuelService } from './fuel.service';
import { Income } from '../incomes/income.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class FuelController {
  constructor(private fuelService: FuelService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('fuel')
  create(@Body() fuelDto): Promise<null> {
    return this.fuelService
      .create(fuelDto)
      .then(result => result)
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'SAME_MILEAGE_VALUE',
          },
          400,
        );
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('fuel')
  findAll(@Query() query): Promise<Income[]> {
    const { filters, limit, month, account } = query;
    if (limit) {
      return this.fuelService.findAll(query.limit);
    } else if (filters) {
      return this.fuelService.findByQuery(query);
    } else if (month) {
      const year = new Date().getFullYear();
      return this.fuelService.getBetweenDates({
        from: `${year}-${month}-01`,
        to: `${year}-${month + 1}-01`,
      });
    } else if (account) {
      return this.fuelService.findByAccountId(account);
    } else {
      return;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('fuel/id/:id')
  findOne(@Param() params): Promise<any> {
    return this.fuelService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('fuel/id/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.fuelService.delete(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('fuel/consumption')
  async getConsumption(@Query() query) {
    // date format: mm/dd/yyyy
    if (query.month) {
      return this.fuelService.consumptionByMonth(query.month);
    }
    return await this.fuelService.consumptionPer100(query.since);
  }
}
