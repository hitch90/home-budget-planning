import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoanService } from './loan.service';

@Controller('')
export class LoanController {
  constructor(private loanService: LoanService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('loan')
  @HttpCode(204)
  async create(@Body() createLoan): Promise<null> {
    console.log(createLoan);
    return this.loanService.create(createLoan);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('loan')
  async findAll(): Promise<any> {
    return this.loanService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('loan/:id')
  findOne(@Param() params): Promise<any> {
    return this.loanService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('loan/:id/plan')
  plan(@Param() params): Promise<any> {
    return this.loanService.getPlan(params.id);
  }
}
