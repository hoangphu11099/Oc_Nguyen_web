import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UpsertPromotionDto } from "./dto/upsert-promotion.dto";
import { PromotionsService } from "./promotions.service";

@Controller("promotions")
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get("active")
  getActive() {
    return this.promotionsService.getActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("admin/current")
  getCurrent() {
    return this.promotionsService.getCurrent();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put("admin/current")
  saveCurrent(@Body() dto: UpsertPromotionDto) {
    return this.promotionsService.saveCurrent(dto);
  }
}
