import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from "class-validator";

export class UpsertPromotionDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsOptional()
  @IsString()
  highlightText?: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsString()
  @IsUrl({}, { message: "Ảnh URL không hợp lệ" })
  imageUrl!: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsBoolean()
  isActive!: boolean;
}
