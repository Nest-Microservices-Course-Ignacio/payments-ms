import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Currency } from '../common/types/currency.enum';

export class CreatePaymentSessionDto {
  @IsString()
  @IsEnum(Currency)
  currency: Currency;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  items: LineItemDto[];
}

export class LineItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  quantity: number;
}
