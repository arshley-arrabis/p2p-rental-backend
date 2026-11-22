import { IsDateString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  itemId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;
}