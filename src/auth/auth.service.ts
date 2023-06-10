import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: RegisterDto) {
    const { email, password, name } = dto;
    const existingUser = await this.prisma.user.findUnique({
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

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid email/password');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '50m',
      }),
    };
  }
}
