import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookingDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}