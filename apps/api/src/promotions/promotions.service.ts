import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpsertPromotionDto } from "./dto/upsert-promotion.dto";

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  getActive() {
    return this.prisma.promotion.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  getCurrent() {
    return this.prisma.promotion.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  async saveCurrent(dto: UpsertPromotionDto) {
    const current = await this.getCurrent();

    if (!current) {
      return this.prisma.promotion.create({
        data: dto,
      });
    }

    return this.prisma.promotion.update({
      where: {
        id: current.id,
      },
      data: dto,
    });
  }
}
