import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from './category.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class CategoriesController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('api/category')
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<null> {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/categories')
  async findAll(@Query() query): Promise<Category[]> {
    return await this.categoryService.findByFilters(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/categories/sum')
  async findParentCategoryWithExpenses(@Query() query): Promise<any> {
    return await this.categoryService.findParentCategoryWithExpenses();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/category/:id')
  findOne(@Param() params): Promise<Category> {
    return this.categoryService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('api/category/:id')
  @HttpCode(204)
  update(
    @Param() params,
    @Body() updateCategoryDto: CreateCategoryDto,
  ): Promise<UpdateResult> {
    return this.categoryService.update(params.id, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('api/category/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.categoryService.delete(params.id);
  }
}
