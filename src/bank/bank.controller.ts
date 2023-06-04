import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto';
import { GetUser } from '../auth/decorator';

@Controller('banks')
@UseGuards(JwtAuthGuard)
export class BankController {
  constructor(private bankService: BankService) {}

  @Post('create')
  createBank(@GetUser('id') userId: number, @Body() dto: CreateBankDto) {
    return this.bankService.createBank(userId, dto);
  }
}
