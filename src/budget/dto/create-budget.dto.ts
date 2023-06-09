import { BudgetItemType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class IBudgetType {
  RECURRING: 'RECURRING';
  NON_RECURRING: 'NON_RECURRING';
}

export class CreateBudgetItemDto {
  @IsString()
  name: string;
  @IsNumber()
  amount: number;
  @IsString()
  type: BudgetItemType;
  @IsDateString()
  date: Date;
}

export class CreateBudgetDto {
  @IsString()
  name: string;
  @IsNumber()
  amount: number;
  @ArrayMinSize(1)
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetItemDto)
  budgetItems: CreateBudgetItemDto[];
}
