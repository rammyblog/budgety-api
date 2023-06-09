import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class initTransactionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  amount: string;
}
