import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifyAccountNumberDto, initTransactionDto } from './dto';
import { IInitTransaction, IVerifyAccountNumber } from './interface';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class PaystackService {
  private readonly secretKey: string;
  private readonly baseUrl: string;
  private readonly logger = new Logger(PaystackService.name);
  constructor(
    private config: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.config.get('PAYSTACK_BASE_URL');
    this.secretKey = this.config.get('PAYSTACK_SECRET_KEY');
  }

  async verifyAccountNumber(
    dto: VerifyAccountNumberDto,
  ): Promise<IVerifyAccountNumber> {
    const headers = { Authorization: `Bearer ${this.secretKey}` };
    const { data } = await firstValueFrom(
      this.httpService
        .get<IVerifyAccountNumber>(
          `${this.baseUrl}/bank/resolve?account_number=${dto.account_number}&bank_code=${dto.bank_code}`,
          { headers },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new BadRequestException('An Error occurred');
          }),
        ),
    );
    return data;
  }

  async initTransaction(dto: initTransactionDto): Promise<IInitTransaction> {
    const headers = { Authorization: `Bearer ${this.secretKey}` };
    const { data } = await firstValueFrom(
      this.httpService
        .post<IInitTransaction>(`${this.baseUrl}/transaction/initialize`, dto, {
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new BadRequestException('An Error occurred');
          }),
        ),
    );
    return data;
  }
}
