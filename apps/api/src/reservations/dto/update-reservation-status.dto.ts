import { ReservationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateReservationStatusDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
