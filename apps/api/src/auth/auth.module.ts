import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { SignOptions } from "jsonwebtoken";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = (config.get<string>("JWT_EXPIRES_IN") ??
          "7d") as SignOptions["expiresIn"];

        return {
          secret: config.get<string>("JWT_SECRET") ?? "oc-nguyen-secret",
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
