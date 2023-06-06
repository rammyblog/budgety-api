import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyAccountNumberDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  bank_code: string;
  @IsString()
  @IsNotEmpty()
  @Length(10, 10)
  account_number: string;
}
