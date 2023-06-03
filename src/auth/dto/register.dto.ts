import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @Length(3, 20)
  @IsString()
  @IsNotEmpty()
  name: string;
  @Length(3, 20)
  @IsNotEmpty()
  @IsString()
  password: string;
}
