import { Processor } from '@nestjs/bullmq';

import { Job } from 'bull';
import { BudgetService } from './budget.service';
import { Budget } from '@prisma/client';
import { Process } from '@nestjs/bull';

@Processor('budgets')
export class BudgetProcessor {
  constructor(private readonly budgetService: BudgetService) {}
  @Process({ name: 'budgets', concurrency: 5 })
  async transcode(job: Job<Budget>) {
    const budget = job.data;
    await this.budgetService.processIndividualJob(budget, job);
    try {
    } catch (e) {
      await job.log(`Error: ${e.message}`);
    }
  }
}
