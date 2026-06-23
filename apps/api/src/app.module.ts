import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MenuModule } from "./menu/menu.module";
import { ReservationsModule } from "./reservations/reservations.module";
import { PromotionsModule } from "./promotions/promotions.module";
import { NotificationsModule } from "./notifications/notifications.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MenuModule,
    ReservationsModule,
    PromotionsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
