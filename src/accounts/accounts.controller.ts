import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put, Query,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './create-account.dto';
import { Account } from './account.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AccountsController {
  constructor(private accountService: AccountService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('api/accounts')
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/accounts')
  findAll(@Query() query): Promise<Account[]> {
    return this.accountService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/accounts/id/:id')
  findOne(@Param() params): Promise<Account> {
    return this.accountService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('api/accounts/id/:id')
  update(
    @Param() params,
    @Body() updateAccountDto: CreateAccountDto,
  ): Promise<UpdateResult> {
    return this.accountService.update(params.id, updateAccountDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('api/accounts/id/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.accountService.delete(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/accounts/balance')
  getBalance(): Promise<number> {
    return this.accountService.getBalance();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('api/accounts/transfer')
  @HttpCode(204)
  transfer(@Body() updateAccountBalance): Promise<any> {
    return this.accountService.transfer(updateAccountBalance);
  }
}
