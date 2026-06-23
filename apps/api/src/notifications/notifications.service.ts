import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationType, Reservation } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsGateway } from "./notifications.gateway";

type ReservationNotificationData = Pick<
  Reservation,
  | "id"
  | "bookingCode"
  | "customerName"
  | "phone"
  | "numberOfGuests"
  | "reservationDate"
>;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  findAll() {
    return this.prisma.notification.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  countUnread() {
    return this.prisma.notification.count({
      where: {
        isRead: false,
      },
    });
  }

  async createFromReservation(reservation: ReservationNotificationData) {
    const reservationTime = new Date(
      reservation.reservationDate,
    ).toLocaleString("vi-VN");

    const bookingCodeText = reservation.bookingCode
      ? `Mã ${reservation.bookingCode} - `
      : "";

    const notification = await this.prisma.notification.create({
      data: {
        title: "Có khách đặt bàn mới",
        message:
          `${bookingCodeText}${reservation.customerName} đặt bàn cho ` +
          `${reservation.numberOfGuests} khách vào ${reservationTime}. ` +
          `SĐT: ${reservation.phone}`,
        type: NotificationType.RESERVATION,
        link: "/admin/reservations",
      },
    });

    // Gửi sự kiện realtime tới trang admin đang mở.
    this.notificationsGateway.sendToAdmin(notification);

    return notification;
  }

  async markAsRead(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException("Không tìm thấy thông báo");
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  markAllAsRead() {
    return this.prisma.notification.updateMany({
      where: {
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException("Không tìm thấy thông báo");
    }

    await this.prisma.notification.delete({
      where: { id },
    });

    return {
      message: "Đã xoá thông báo",
    };
  }
}
