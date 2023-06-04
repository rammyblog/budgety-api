import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class BankService {
  constructor(private prisma: PrismaService) {}
  //   verify duplicate banks, verify bank code
  createBank(userId: number, dto: CreateBankDto) {
    return this.prisma.bank.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  findBankById(id: number, userId: number) {
    return this.prisma.bank.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  findBanks(userId: number) {
    return this.prisma.bank.findMany({
      where: {
        userId,
      },
    });
  }
}
