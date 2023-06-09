import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorator';
import { CreateBudgetDto } from './dto';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  @Post()
  createBudget(@GetUser('id') userId: number, @Body() dto: CreateBudgetDto) {
    return this.budgetService.createBudget(userId, dto);
  }
}
