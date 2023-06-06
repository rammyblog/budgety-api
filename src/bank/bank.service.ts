import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankDto } from './dto';
import { User } from '@prisma/client';
import { PaystackService } from '../lib/paystack/paystack.service';

@Injectable()
export class BankService {
  constructor(
    private prisma: PrismaService,
    private paystackService: PaystackService,
  ) {}
  //   verify duplicate banks, verify bank code
  async createBank(userId: number, dto: CreateBankDto) {
    const { data } = await this.paystackService.verifyAccountNumber({
      bank_code: dto.code,
      account_number: dto.accountNumber,
    });
    return this.prisma.bank.create({
      data: {
        ...dto,
        accountName: data.account_name,
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
