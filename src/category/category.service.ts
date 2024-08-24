import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './entities/dto/create-category.dto';
import { UpdateCategoryDto } from './entities/dto/update-category.dto';
import { CATEGORY_NOT_FOUND_ERROR, EXIST_CATEGORY_ERROR } from './category.constants';

@Injectable()
export class CategoryService {
	constructor(@InjectRepository(Category)
	private readonly categoryRepository: Repository<Category>
	) { }

	async create(createCategory: CreateCategoryDto, id: number) {
		const isExist = await this.categoryRepository.findBy({
			user: { id },
			title: createCategory.title
		})
		if (isExist.length) {
			throw new BadRequestException(EXIST_CATEGORY_ERROR)
		}
		return this.categoryRepository.save({
			title: createCategory.title,
			user: { id }
		})
	}

	async findAll(id: number) {
		return await this.categoryRepository.find({
			where: {
				user: { id },
			},
			relations: {
				transactions: true
			}
		})
	}

	async findOne(id: number) {
		return await this.categoryRepository.findOne({
			where: { id },
			relations: {
				user: true,
				transactions: true
			}
		})
	}

	async update(id: number, updateCategory: UpdateCategoryDto) {
		const updatedCategory = await this.categoryRepository.update(id, updateCategory)
		console.log(updatedCategory)
		if (!updatedCategory) {
			throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR)
		}

		return updatedCategory
	}

	async remove(id: number) {
		return this.categoryRepository.delete(id)
	}
}
