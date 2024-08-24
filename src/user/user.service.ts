import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { USER_EXESTS_ERROR } from './user.constants';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
  private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      }
    })
    if (existUser) {
      throw new UnauthorizedException(USER_EXESTS_ERROR)
    }
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    })

    const token = this.jwtService.sign({ email: createUserDto.email})

    return { user, token };
  }

  async findOne(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email
      }
    });
  }

}
