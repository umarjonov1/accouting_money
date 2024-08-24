import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { UpdateCategoryDto } from './entities/dto/update-category.dto';
import { CATEGORY_NOT_FOUND_ERROR, EXIST_CATEGORY_ERROR } from './category.constants';
import { AuthorGuard } from 'src/guards/author.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req) {
    return await this.categoryService.create(createCategoryDto, +req.user.id)
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return await this.categoryService.findAll(+req.user.id)
  }

  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id)
    if (!category){
    	throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR)
    }
    return category
  }

  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async update(@Param('id') id: string, @Body() updateCategory: UpdateCategoryDto) {
    const updatedCategory = await this.categoryService.update(+id, updateCategory)
    console.log(updatedCategory)
    if (!updatedCategory) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR)
    }
    return `Category was updated`
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  async delete(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id)
    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR)
    }
    await this.categoryService.remove(+id)
    return `Category '${category.title}' was deleted`
  }
}
