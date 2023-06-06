import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BankModule } from './bank/bank.module';
import { PaystackModule } from './lib/paystack/paystack.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    BankModule,
    PaystackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
