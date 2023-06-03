import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new HttpException('user already exist', HttpStatus.BAD_REQUEST);
    }
    const hash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hash,
        name,
      },
    });
    delete user.password;
    // return saved user
    return user;
  }

  async login() {
    return 'login';
  }
}
