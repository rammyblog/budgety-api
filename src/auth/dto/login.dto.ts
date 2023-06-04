import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @Length(3, 20)
  @IsNotEmpty()
  @IsString()
  password: string;
}
