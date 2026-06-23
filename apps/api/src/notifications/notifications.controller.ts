import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@prisma/client";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { NotificationsService } from "./notifications.service";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("notifications/admin")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get("unread-count")
  countUnread() {
    return this.notificationsService.countUnread();
  }

  @Patch("read-all")
  markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  @Patch(":id/read")
  markAsRead(@Param("id", ParseIntPipe) id: number) {
    return this.notificationsService.markAsRead(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.notificationsService.remove(id);
  }
}
