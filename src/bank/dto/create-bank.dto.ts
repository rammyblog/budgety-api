import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBankDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  code: string;
  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  accountNumber: string;
  @IsNotEmpty()
  @IsString()
  accountName: string;
}
