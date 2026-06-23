import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
} from "class-validator";

import { Type } from "class-transformer";

export enum TableType {
  NORMAL = "NORMAL",
  VIP = "VIP",
}

// 🍤 DTO cho món đặt trước
class PreOrderItemDto {
  @IsInt()
  @Type(() => Number)
  menuItemId!: number;

  @IsInt()
  @Type(() => Number)
  quantity!: number;
}

export class CreateReservationDto {
  @IsString()
  customerName!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsInt()
  @Type(() => Number)
  numberOfGuests!: number;

  @IsString()
  reservationDate!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsEnum(TableType)
  tableType!: TableType;

  // 🍽 món đặt trước
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreOrderItemDto)
  preOrderItems?: PreOrderItemDto[];
}
