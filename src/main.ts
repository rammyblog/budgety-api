import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Queue } from 'bull';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // Setup BullBoard UI
  const budgetsQueue = app.get<Queue>('BullQueue_budgets');
  const serverAdapter = new ExpressAdapter();
  createBullBoard({
    queues: [new BullAdapter(budgetsQueue)],
    serverAdapter,
  });
  serverAdapter.setBasePath('/admin/queue');
  app.use('/admin/queue', serverAdapter.getRouter());
  await app.listen(8080);
}
bootstrap();
