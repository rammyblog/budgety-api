import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Queue } from 'bull';
import { AppModule } from './app.module';

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
