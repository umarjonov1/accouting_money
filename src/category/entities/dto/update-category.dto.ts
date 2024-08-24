import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

export class UpdateCategoryDto extends PartialType(CreateAuthDto) { }