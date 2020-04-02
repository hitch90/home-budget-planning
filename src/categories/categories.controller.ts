import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from './category.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class CategoriesController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('category')
  @HttpCode(204)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<null> {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('categories')
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('category/:id')
  findOne(@Param() params): Promise<Category> {
    return this.categoryService.findOne(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('category/:id')
  @HttpCode(204)
  update(@Param() params, @Body() updateCategoryDto: CreateCategoryDto): Promise<UpdateResult> {
    return this.categoryService.update(params.id, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('category/:id')
  @HttpCode(204)
  delete(@Param() params): Promise<DeleteResult> {
    return this.categoryService.delete(params.id);
  }
}
