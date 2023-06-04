import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  @Get(':id')
  getBankById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ) {
    return this.bankService.findBankById(id, userId);
  }

  @Get()
  getBanks(@GetUser('id') userId: number) {
    return this.bankService.findBanks(userId);
  }
}
