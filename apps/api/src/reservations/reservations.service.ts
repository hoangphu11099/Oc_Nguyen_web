import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ReservationStatus, Reservation } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // =========================
  // GENERATE BOOKING CODE
  // =========================
  private async generateBookingCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.reservation.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
        },
      },
    });
    const nextNumber = (count + 1).toString().padStart(4, "0");
    return `OC-${year}-${nextNumber}`;
  }

  // =========================
  // CREATE RESERVATION
  // =========================
  async create(dto: CreateReservationDto, userId?: number) {
    try {
      const bookingCode = await this.generateBookingCode();

      const reservation = await this.prisma.reservation.create({
        data: {
          customerName: dto.customerName,
          phone: dto.phone,
          email: dto.email,
          numberOfGuests: dto.numberOfGuests,
          reservationDate: new Date(dto.reservationDate),
          note: dto.note,
          tableType: dto.tableType,
          bookingCode,
          items: {
            create: dto.preOrderItems?.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
            })),
          },
          userId,
        },
        include: {
          items: {
            include: { menuItem: true }, // include món cho admin
          },
        },
      });

      // Tạo notification cho admin
      await this.notificationsService.createFromReservation(reservation);

      this.logger.log(
        `New reservation: ${reservation.customerName} - ${reservation.phone}`,
      );

      return {
        message: "Đặt bàn thành công! Cảm ơn bạn đã đặt trước.",
        reservation,
      };
    } catch (error) {
      this.logger.error("Create reservation failed", error);
      throw error;
    }
  }

  // =========================
  // GET ALL RESERVATIONS
  // =========================
  findAll() {
    return this.prisma.reservation.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { menuItem: true } }, // admin thấy món
      },
      orderBy: { createdAt: "asc" },
    });
  }

  // =========================
  // GET ONE RESERVATION
  // =========================
  async findOne(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } } },
    });

    if (!reservation) {
      throw new NotFoundException("Không tìm thấy đặt bàn");
    }

    return reservation;
  }

  // =========================
  // UPDATE STATUS
  // =========================
  async updateStatus(id: number, status: ReservationStatus) {
    await this.findOne(id);

    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }

  // =========================
  // DELETE RESERVATION
  // =========================
  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.$transaction([
      // Xoá các món đặt trước thuộc đơn này trước
      this.prisma.reservationItem.deleteMany({
        where: {
          reservationId: id,
        },
      }),

      // Sau đó mới xoá đặt bàn
      this.prisma.reservation.delete({
        where: {
          id,
        },
      }),
    ]);

    return {
      message: "Đã xoá đặt bàn thành công",
    };
  }
}
